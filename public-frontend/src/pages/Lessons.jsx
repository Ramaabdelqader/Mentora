import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCourse, getLessons, getLesson } from "../api/publicApi";
import VideoPlayer from "../components/VideoPlayer";

export default function Lesson() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();

  const courseId = Number(id);
  const currentLessonId = Number(lessonId);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // 1) Load course (title for sidebar header, etc.)
        const c = await getCourse(courseId).catch(() => null);

        // 2) Curriculum list (safe fields only)
        const fromCourse = Array.isArray(c?.Lessons)
          ? c.Lessons
          : Array.isArray(c?.lessons)
          ? c.lessons
          : [];

        let ls = fromCourse;
        if (!ls || ls.length === 0) {
          ls = await getLessons(courseId); // GET /lessons?courseId=#
        }

        // 3) Sort by order
        ls = (ls || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // 4) Try to find stub from list
        const stub = ls.find((x) => Number(x.id) === currentLessonId) || null;

        // 5) Secure fetch for the active lesson (requires login + enrollment)
        const full = await getLesson(currentLessonId); // GET /lessons/:id (auth)
        if (!alive) return;

        setCourse(c);
        setLessons(ls);
        setCurrent(stub ? { ...stub, ...full } : full);
      } catch (e) {
        if (!alive) return;
        const s = e?.response?.status;

        if (s === 401) {
          // Not authenticated — Protected should handle, but do a safety redirect
          const redirect = encodeURIComponent(`/courses/${id}/lessons/${lessonId}`);
          navigate(`/login?redirect=${redirect}`, { replace: true });
          return;
        }

        if (s === 403) {
          // Not enrolled in this course
          setErr("Please enroll to access this lesson.");
          return;
        }

        setErr("Failed to load lesson.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [courseId, currentLessonId, id, lessonId, navigate]);

  const idx = useMemo(
    () => lessons.findIndex((x) => Number(x.id) === currentLessonId),
    [lessons, currentLessonId]
  );
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="card p-6">
          <p className="text-gray-600">Loading lesson…</p>
        </div>
      </div>
    );
  }

  if (err) {
    // 403 path shows a CTA to enroll
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="card p-6 space-y-3">
          <p className="text-red-600">{err}</p>
          <div className="flex gap-3">
            <Link className="btn btn-outline" to={`/courses/${courseId}`}>
              Back to course
            </Link>
            <Link className="btn btn-primary" to={`/courses/${courseId}`}>
              Enroll now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="card p-6">
          <p className="text-gray-600">Lesson not found.</p>
          <Link className="btn btn-outline mt-3" to={`/courses/${courseId}`}>
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid lg:grid-cols-[2fr,1fr] gap-8">
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">{current.title}</h1>

        {/* Video / Embed (only available when enrolled due to secure fetch) */}
        <VideoPlayer url={current.videoUrl} title={current.title} />

        {/* Content / Notes */}
        {current.content ? (
          <div className="card p-6">
            <div className="whitespace-pre-wrap text-gray-800">
              {current.content}
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <p className="text-gray-600">No content provided for this lesson.</p>
          </div>
        )}

        {/* Pager */}
        <div className="flex items-center justify-between">
          {prev ? (
            <Link className="btn btn-outline" to={`/courses/${courseId}/lessons/${prev.id}`}>
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="btn btn-primary" to={`/courses/${courseId}/lessons/${next.id}`}>
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>

      {/* Sidebar: all lessons (titles only, safe for public) */}
      <aside className="card p-4 h-fit sticky top-24">
        <h3 className="font-semibold mb-3">{course?.title || "Course curriculum"}</h3>
        {lessons.length === 0 ? (
          <p className="text-gray-600">No lessons yet.</p>
        ) : (
          <ul className="space-y-2">
            {lessons.map((l, i) => {
              const active = Number(l.id) === currentLessonId;
              return (
                <li key={l.id}>
                  <Link
                    to={`/courses/${courseId}/lessons/${l.id}`}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 ring-1 ${
                      active
                        ? "ring-blue-500 bg-blue-50"
                        : "ring-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <span className="h-6 w-6 rounded-full bg-gray-100 text-xs grid place-items-center">
                      {i + 1}
                    </span>
                    <span className="truncate">{l.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}
