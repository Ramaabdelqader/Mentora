import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <h1 className="font-semibold text-gray-700">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        {user && <span className="text-gray-600">Hi, {user.name}</span>}
        <button onClick={logout} className="btn btn-outline">Logout</button>
      </div>
    </header>
  );
}
