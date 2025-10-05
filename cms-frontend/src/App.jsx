import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Protected from "./components/Protected";
import StaffOnly from "./components/StaffOnly";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Lessons from "./pages/Lessons";
import Users from "./pages/Users";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Layout for all CMS pages
function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route (no auth) */}
        <Route path="/login" element={<Login />} />

        {/* Protected + staff-only shell */}
        <Route
          path="/"
          element={
            <Protected>
              <StaffOnly>
                <Layout />
              </StaffOnly>
            </Protected>
          }
        >
          {/* When visiting exactly "/", go to /dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* CMS pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="users" element={<Users />} />

          {/* 404 for unknown CMS paths */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
