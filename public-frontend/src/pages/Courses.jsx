import { useEffect, useState } from "react";
import CategoryPills from "../components/CategoryPills";
import SearchBar from "../components/SearchBar";
import CourseCard from "../components/CourseCard";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";
import { getCategories, getCourses } from "../api/publicApi"; // ✅ real API

export default function Courses() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]); // names only, no "All" here

  // initial load: fetch categories + all courses once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [cats, cs] = await Promise.all([getCategories(), getCourses()]);
        if (!alive) return;
        setCategories(cats.map((c) => c.name));
        setAllCourses(cs);
      } catch (e) {
        console.error("Failed to load courses/categories", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // derive filtered + paginated list whenever filters/page change
  useEffect(() => {
    // show skeleton only on the initial fetch; for filter changes we can skip it
    let list = allCourses;

    if (cat !== "All") {
      list = list.filter((c) => c.Category?.name === cat);
    }

    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          (c.description || "").toLowerCase().includes(term)
      );
    }

    setTotal(list.length);

    const start = (page - 1) * pageSize;
    const pageItems = list.slice(start, start + pageSize).map((c) => ({
      // normalize to what CourseCard expects
      ...c,
      short:
        (c.description || "").slice(0, 120) +
        ((c.description || "").length > 120 ? "..." : ""),
      instructor: {
        name: c.instructor?.name || "—",
        avatar: "https://i.pravatar.cc/100?img=12",
      },
      rating: 4.7, // placeholders until ratings exist in backend
      ratingsCount: 1000,
      studentsCount: 5000,
      thumbnail:
        c.thumbnail ||
"coding.jpg"      }));

    setCourses(pageItems);
  }, [allCourses, cat, q, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold">Browse courses</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr,260px]">
        <div className="space-y-6">
          <SearchBar
            value={q}
            onChange={setQ}
            onSubmit={() => {
              setPage(1);
            }}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-gray-600">No courses match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard key={c.id} c={c} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
          </div>
        </div>

        <aside className="card h-fit p-4">
          <h3 className="font-semibold mb-3">Categories</h3>
          {/* CategoryPills doesn’t need "All"; we keep "All" only in state */}
          <CategoryPills
            categories={categories}
            active={cat}
            onChange={(x) => {
              setCat(x);
              setPage(1);
            }}
          />
        </aside>
      </div>
    </div>
  );
}
