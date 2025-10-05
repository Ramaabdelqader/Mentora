import { useEffect, useMemo, useState } from "react";
import Protected from "../components/Protected";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../api/publicApi";

export default function Profile() {
  return (
    <Protected>
      <ProfileInner />
    </Protected>
  );
}

function ProfileInner() {
  const { user, logout } = useAuth();
  const [allCourses, setAllCourses] = useState([]);

  // ✅ Not state (no setter), just read once and memoize
  const myCourseIds = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("mentora_my_courses") || "[]");
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    (async () => {
      const cs = await getCourses();
      setAllCourses(cs);
    })();
  }, []);

  const myCourses =
    myCourseIds.length > 0
      ? allCourses.filter((c) => myCourseIds.includes(c.id))
      : allCourses;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-8">
      <div className="card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <button onClick={logout} className="btn btn-outline">Logout</button>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My courses</h2>
        {myCourses.length === 0 ? (
          <p className="text-gray-600">No courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((c) => (
              <CourseCard
                key={c.id}
                c={{
                  ...c,
                  short:
                    (c.description || "").slice(0, 120) +
                    ((c.description || "").length > 120 ? "..." : ""),
                  instructor: {
                    name: c.instructor?.name || "—",
                    avatar: "https://i.pravatar.cc/100?img=12",
                  },
                  rating: 4.7,
                  ratingsCount: 1000,
                  studentsCount: 5000,
                  thumbnail:
                    c.thumbnail ||
                    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
