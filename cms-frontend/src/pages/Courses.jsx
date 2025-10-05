import { useEffect, useState } from "react";
import {
  listCourses,
  createCourse,
  deleteCourse,
  listCategories,
} from "../api/cmsApi";

export default function Courses() {
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("0h");
  const [thumbnail, setThumbnail] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [courses, categories] = await Promise.all([
          listCourses(),
          listCategories(),
        ]);
        if (!alive) return;
        setList(courses);
        setCats(categories);
        setCategoryId(categories[0]?.id ?? "");
      } catch (e) {
        console.error(e);
        setErr(e?.response?.data?.message || "Failed to load courses");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setErr("");

    if (!title.trim() || !description.trim() || !categoryId) {
      setErr("Please fill in Title, Description, and select a Category.");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        level: level || "Beginner",
        duration: duration || "0h",
        thumbnail: thumbnail.trim(),
        categoryId, // backend expects "categoryId" (will be mapped to CategoryId)
      };
      const created = await createCourse(body);
      setList((prev) => [created, ...prev]);
      // reset form
      setTitle("");
      setDescription("");
      setPrice(0);
      setLevel("Beginner");
      setDuration("0h");
      setThumbnail("");
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setErr("");
    try {
      await deleteCourse(id);
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to delete course");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>

      {/* Add form */}
      <form onSubmit={handleAdd} className="card mb-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="input"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="input"
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
          />
          <input
            className="input"
            placeholder="Level (e.g., Beginner)"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
          <input
            className="input"
            placeholder="Duration (e.g., 10h)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <input
          className="input"
          placeholder="Thumbnail URL (optional)"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Course"}
        </button>
      </form>

      {/* List */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-600">Loading courses…</div>
        ) : list.length === 0 ? (
          <div className="p-6 text-gray-600">No courses yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Instructor</th>
                <th className="p-2">Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">{c.id}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.Category?.name || "—"}</td>
                  <td className="p-2">{c.instructor?.name || "—"}</td>
                  <td className="p-2">${Number(c.price || 0).toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(c.id)}
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
