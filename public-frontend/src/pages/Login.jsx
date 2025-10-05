import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const rawRedirect = new URLSearchParams(location.search).get("redirect") || "/profile";
  // prevent open-redirects to external sites
  const redirect = rawRedirect.startsWith("/") ? rawRedirect : "/profile";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email, password }); // calls real API via AuthContext
      navigate(redirect, { replace: true });
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.message ||
        "Invalid credentials";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !email || !password;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={disabled}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
