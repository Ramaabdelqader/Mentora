import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import { getCourse, getMyEnrollments, enrollCourse, dropEnrollment, getLessons } from "../api/publicApi";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const courseIdNum = Number(id);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showToast, setShowToast] = useState("");

  // modal state
  const [confirm, setConfirm] = useState({ open: false, type: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getCourse(courseIdNum);

        // normalize course
        const desc = data.description || "";
        const includedLessons =
          Array.isArray(data.Lessons) ? data.Lessons :
          Array.isArray(data.lessons) ? data.lessons : [];

        const normalized = {
          ...data,
          short: desc.slice(0, 160) + (desc.length > 160 ? "..." : ""),
          rating: 4.7,
          ratingsCount: 1000,
          studentsCount: 5000,
          instructor: {
            name: data.instructor?.name || "—",
            avatar: "https://i.pravatar.cc/100?img=12",
          },
          thumbnail:
            data.thumbnail ||
            "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
        };

        // lessons (prefer included, else fetch)
        let ls = includedLessons;
        if (!ls || ls.length === 0) {
          ls = await getLessons(courseIdNum);
        }
        ls = (ls || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // check enrollment from DB
        const mine = await getMyEnrollments().catch(() => []);
        const mySet = new Set(mine.map((m) => m.CourseId ?? m.courseId ?? m.Course?.id));
        if (!alive) return;

        setCourse(normalized);
        setLessons(ls);
        setEnrolled(mySet.has(courseIdNum));
      } catch (e) {
        console.error("Failed to load course", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [courseIdNum]);

  // Open modal flows
  function openEnrollConfirm() {
    if (!isAuthenticated) {
      navigate("/login?redirect=" + encodeURIComponent(`/courses/${id}`));
      return;
    }
    setConfirm({ open: true, type: "enroll" });
  }
  function openDropConfirm() {
    setConfirm({ open: true, type: "drop" });
  }

  // Confirm actions
  async function onConfirm() {
    try {
      setBusy(true);
      if (confirm.type === "enroll") {
        await enrollCourse(courseIdNum);
        setEnrolled(true);
        setShowToast("Enrolled! Start learning.");
      } else if (confirm.type === "drop") {
        await dropEnrollment(courseIdNum);
        setEnrolled(false);
        setShowToast("Enrollment canceled.");
      }
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "Operation failed";
      setShowToast(msg);
    } finally {
      setBusy(false);
      setConfirm({ open: false, type: null });
    }
  }
  function onCancel() {
    if (!busy) setConfirm({ open: false, type: null });
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="h-64 card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <img
          src={course.thumbnail}
          alt=""
          className="w-full h-72 object-cover rounded-2xl ring-1 ring-gray-200"
        />
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.short}</p>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-700">
            <RatingStars value={course.rating} />
            <span>
              {course.rating} ({course.ratingsCount} ratings)
            </span>
            <span>•</span>
            <span>{course.studentsCount.toLocaleString()} students</span>
          </div>
        </div>

        {/* Curriculum */}
        <section>
          <h2 className="text-xl font-semibold">Curriculum</h2>
          {lessons.length === 0 ? (
            <p className="text-gray-600 mt-3">No lessons yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {lessons.map((l, i) => (
                <li key={l.id} className="card p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <p className="font-medium">{l.title}</p>
                  </div>
                  {enrolled ? (
                    <Link className="btn btn-outline" to={`/courses/${courseIdNum}/lessons/${l.id}`}>
                      View
                    </Link>
                  ) : (
                    <button className="btn btn-outline" onClick={openEnrollConfirm}>
                      Enroll to view
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Instructor */}
        <section>
          <h2 className="text-xl font-semibold">Instructor</h2>
          <div className="mt-3 flex items-center gap-3">
            <img src={course.instructor.avatar} alt="" className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-medium">{course.instructor.name}</p>
              <p className="text-sm text-gray-600">
                {course.level} • {course.duration}
              </p>
            </div>
          </div>
        </section>
      </div>

      <aside className="card p-5 h-fit sticky top-24">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${course.price}</span>
          <span className="text-sm text-gray-600">{course.level}</span>
        </div>

        {!enrolled ? (
          <button
            onClick={openEnrollConfirm}
            disabled={busy}
            className={`btn w-full mt-4 ${busy ? "btn-outline cursor-default" : "btn-primary"}`}
          >
            {busy ? "Processing..." : "Enroll now"}
          </button>
        ) : (
          <div className="mt-4 flex gap-2">
            <button className="btn btn-outline w-full cursor-default" disabled>
              Enrolled
            </button>
            <button className="btn w-full" onClick={openDropConfirm} disabled={busy}>
              {busy ? "..." : "Drop"}
            </button>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-3">
          30-day satisfaction guarantee. Lifetime access.
        </p>
      </aside>

      {/* Toast */}
      {showToast && <Toast text={showToast} />}

      {/* Confirm modal */}
      <ConfirmModal
        open={confirm.open}
        title={confirm.type === "drop" ? "Cancel enrollment?" : "Enroll in this course?"}
        message={
          confirm.type === "drop"
            ? "You will be removed from this course. You can re-enroll anytime."
            : "You will be enrolled and gain access to all lessons."
        }
        confirmText={confirm.type === "drop" ? "Yes, cancel" : "Yes, enroll"}
        cancelText="No, go back"
        onConfirm={onConfirm}
        onCancel={onCancel}
        busy={busy}
      />
    </div>
  );
}
