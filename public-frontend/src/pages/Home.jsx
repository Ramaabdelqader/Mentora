import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CourseCard from "../components/CourseCard";
import SkeletonCard from "../components/SkeletonCard";
import { getCourses } from "../api/publicApi"; // ✅ real API

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cs = await getCourses();
        if (!alive) return;

        // Pick the first 6 as "featured" (you can change the logic later)
        const top = cs.slice(0, 6).map((c) => ({
          ...c,
          short:
            (c.description || "").slice(0, 120) +
            ((c.description || "").length > 120 ? "..." : ""),
          instructor: {
            name: c.instructor?.name || "—",
            avatar: "https://i.pravatar.cc/100?img=12",
          },
          rating: 4.7,          // placeholders until ratings exist in backend
          ratingsCount: 1000,
          studentsCount: 5000,
          thumbnail:
            c.thumbnail ||
            "/coding.jpg",
        }));

        setFeatured(top);
      } catch (e) {
        console.error("Failed to load featured courses", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <section id="featured" className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured courses</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="mt-6 text-gray-600">No courses available yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-16">
        <div className="card p-6 md:p-8 text-center">
          <h3 className="text-xl font-semibold">Learn your way</h3>
          <p className="text-gray-600 mt-2">
            Lifetime access, downloadable resources, certificate of completion (coming soon).
          </p>
        </div>
      </section>
    </>
  );
}
