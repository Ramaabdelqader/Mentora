import { useEffect, useState } from "react";
import { listCourses, listLessons, listUsers } from "../api/cmsApi";

export default function Dashboard() {
  const [stats, setStats] = useState({ courses: 0, lessons: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [cs, ls, us] = await Promise.all([
          listCourses(),
          listLessons(),
          // /users is admin-only—if you're logged in as instructor, this will 403.
          listUsers().catch(() => []),
        ]);
        if (!alive) return;
        setStats({ courses: cs.length, lessons: ls.length, users: us.length });
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || "Failed to load stats");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Overview</h2>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Courses" value={stats.courses} loading={loading} />
        <StatCard label="Lessons" value={stats.lessons} loading={loading} />
        <StatCard label="Users" value={stats.users} loading={loading} hint="(admin only)" />
      </div>
    </div>
  );
}

function StatCard({ label, value, loading, hint }) {
  return (
    <div className="card p-4">
      <h3 className="text-sm text-gray-500">
        {label} {hint && <span className="text-gray-400">{hint}</span>}
      </h3>
      {loading ? (
        <div className="h-7 w-16 mt-2 rounded bg-gray-200 animate-pulse" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
    </div>
  );
}
