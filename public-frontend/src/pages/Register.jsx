import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth(); // calls POST /api/auth/register and stores token+user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const rawRedirect = new URLSearchParams(location.search).get("redirect") || "/profile";
  const redirect = rawRedirect.startsWith("/") ? rawRedirect : "/profile";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim() || !email.trim() || !password) {
      setErr("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      // register() auto-saves token+user; go to profile (or ?redirect=...)
      navigate(redirect, { replace: true });
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.message ||
        "Registration failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !name || !email || !password;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Create your account</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete="new-password"
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={disabled}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
