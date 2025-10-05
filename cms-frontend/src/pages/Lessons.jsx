import { useEffect, useState } from "react";
import {
  listLessons,
  createLesson,
  deleteLesson,
  listCourses,
} from "../api/cmsApi";

export default function Lessons() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(""); // selected course for listing/creating
  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // form fields
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");

  // initial load: fetch courses and first course's lessons
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const cs = await listCourses();
        if (!alive) return;
        setCourses(cs);

        const first = cs[0]?.id ? String(cs[0].id) : "";
        setCourseId(first);

        if (first) {
          const ls = await listLessons(first);
          setList(ls.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        } else {
          setList([]);
        }
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "Failed to load lessons.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function changeCourse(id) {
    setCourseId(id);
    setErr("");
    setLoading(true);
    try {
      const ls = await listLessons(id);
      setList(ls.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load lessons.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim() || !courseId) {
      setErr("Please enter a lesson title and select a course.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createLesson({
        title: title.trim(),
        order: Number(order) || 0,
        videoUrl: videoUrl.trim(),
        content: content.trim(),
        courseId: Number(courseId), // backend expects courseId -> mapped to CourseId
      });
      setList((prev) =>
        [...prev, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      );
      // reset form
      setTitle("");
      setOrder(0);
      setVideoUrl("");
      setContent("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create lesson.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setErr("");
    try {
      await deleteLesson(id);
      setList((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to delete lesson.");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Lessons</h2>

      {/* Course selector */}
      <div className="card mb-4">
        <label className="text-sm text-gray-600 mb-1 block">Course</label>
        <select
          className="input"
          value={courseId}
          onChange={(e) => changeCourse(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Add lesson form */}
      <form onSubmit={handleAdd} className="card mb-6 space-y-3">
        <input
          className="input"
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="input"
            type="number"
            placeholder="Order (e.g., 1)"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min="0"
          />
          <input
            className="input"
            placeholder="Video URL (optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <div /> {/* spacer */}
        </div>
        <textarea
          className="input"
          placeholder="Content / notes (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting || !courseId}>
          {submitting ? "Adding..." : "Add Lesson"}
        </button>
      </form>

      {/* List */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-600">Loading lessons…</div>
        ) : list.length === 0 ? (
          <div className="p-6 text-gray-600">No lessons yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Order</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{l.id}</td>
                  <td className="p-2">{l.title}</td>
                  <td className="p-2">{l.order ?? 0}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="btn btn-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
