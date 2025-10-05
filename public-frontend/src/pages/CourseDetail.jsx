import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RatingStars from "../components/RatingStars";
import { getCourse } from "../api/publicApi"; 
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [showToast, setShowToast] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getCourse(id); // { id,title,description,price,level,duration,thumbnail, Category, instructor, Lessons }
        if (!alive) return;

        // Normalize backend data to what the UI expects
        const desc = data.description || "";
        const lessons = Array.isArray(data.Lessons) ? data.Lessons : [];
        const syllabus = lessons
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((l) => l.title);

        const normalized = {
          ...data,
          short: desc.slice(0, 160) + (desc.length > 160 ? "..." : ""),
          rating: 4.7, // placeholder until ratings exist in backend
          ratingsCount: 1000,
          studentsCount: 5000,
          instructor: {
            name: data.instructor?.name || "—",
            avatar: "https://i.pravatar.cc/100?img=12",
          },
          thumbnail:
            data.thumbnail ||
            "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
          syllabus,
        };

        setCourse(normalized);

        // mark enrolled flag from localStorage (temporary until real enrollments)
        const myIds = JSON.parse(localStorage.getItem("mentora_my_courses") || "[]");
        setEnrolled(myIds.includes(Number(id)));
      } catch (e) {
        console.error("Failed to load course", e);
        setCourse(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  function handleEnroll() {
    if (!isAuthenticated) {
      navigate("/login?redirect=" + encodeURIComponent(`/courses/${id}`));
      return;
    }
    // Temporary local enrollment so Profile can show "My courses"
    const key = "mentora_my_courses";
    const cur = JSON.parse(localStorage.getItem(key) || "[]");
    const numId = Number(id);
    if (!cur.includes(numId)) {
      localStorage.setItem(key, JSON.stringify([...cur, numId]));
    }
    setEnrolled(true);
    setShowToast("Enrolled successfully! Find it in 'My learning'.");
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

        <section>
          <h2 className="text-xl font-semibold">What you’ll learn</h2>
          <ul className="mt-3 grid md:grid-cols-2 gap-2">
            {course.syllabus.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1">✅</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

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
        <button
          onClick={handleEnroll}
          disabled={enrolled}
          className={`btn w-full mt-4 ${enrolled ? "btn-outline cursor-default" : "btn-primary"}`}
        >
          {enrolled ? "Enrolled" : "Enroll now"}
        </button>
        <p className="text-sm text-gray-600 mt-3">
          30-day satisfaction guarantee. Lifetime access.
        </p>
      </aside>

      {showToast && <Toast text={showToast} />}
    </div>
  );
}
