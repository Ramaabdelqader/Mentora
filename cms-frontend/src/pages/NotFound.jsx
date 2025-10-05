import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <Link to="/dashboard" className="btn btn-primary mt-4">Go Dashboard</Link>
    </div>
  );
}
