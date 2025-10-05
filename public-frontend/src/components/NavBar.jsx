import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-blue-600">Mentora</Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/courses" className={({isActive})=>isActive?"text-blue-600 font-medium":"text-gray-700 hover:text-blue-600"}>Courses</NavLink>
            <NavLink to="/profile" className={({isActive})=>isActive?"text-blue-600 font-medium":"text-gray-700 hover:text-blue-600"}>My learning</NavLink>
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline">Log in</Link>
                <Link to="/register" className="btn btn-primary">Sign up</Link>
              </>
            ) : (
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="btn btn-outline"
              >
                Logout
              </button>
            )}
          </div>

          {/* mobile */}
          <div className="md:hidden">
            <Link to="/courses" className="btn btn-outline">Browse</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
