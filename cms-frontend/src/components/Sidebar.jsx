import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-lg ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 space-y-2">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Mentora CMS</h2>
      <NavLink to="/dashboard" className={navClasses}>Dashboard</NavLink>
      <NavLink to="/courses" className={navClasses}>Courses</NavLink>
      <NavLink to="/lessons" className={navClasses}>Lessons</NavLink>
      <NavLink to="/users" className={navClasses}>Users</NavLink>
    </aside>
  );
}
