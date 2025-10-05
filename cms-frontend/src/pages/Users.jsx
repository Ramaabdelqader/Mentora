import { useEffect, useState } from "react";
import {
  listUsers,
  setUserRole,
  resetUserPassword,
  deleteUser,
  registerUser, // added in cmsApi
} from "../api/cmsApi";

export default function Users() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const users = await listUsers(); // admin only
        setList(users);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load users (admin only).");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setErr("");
    if (!name.trim() || !email.trim() || !password) {
      setErr("Please fill in name, email, and password.");
      return;
    }
    setCreating(true);
    try {
      // 1) create as student via public auth endpoint
      const { user } = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      // 2) if desired role != student → elevate via admin endpoint
      if (role !== "student") {
        await setUserRole(user.id, role);
        user.role = role;
      }
      setList((prev) => [user, ...prev]);
      // reset form
      setName(""); setEmail(""); setPassword(""); setRole("student");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create user.");
    } finally {
      setCreating(false);
    }
  }

  async function changeRole(id, newRole) {
    try {
      await setUserRole(id, newRole);
      setList((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to change role.");
    }
  }

  async function resetPwd(id) {
    const pwd = prompt("New password:");
    if (!pwd) return;
    try {
      await resetUserPassword(id, pwd);
      alert("Password updated.");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to reset password.");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setList((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete user.");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      {/* Create user (admin) */}
      <form onSubmit={handleCreate} className="card mb-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-primary" type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create user"}
        </button>
      </form>

      {/* List */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-6 text-gray-600">Loading users…</div>
        ) : list.length === 0 ? (
          <div className="p-6 text-gray-600">No users.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select
                      className="input"
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button className="btn btn-outline" onClick={() => resetPwd(u.id)}>Reset password</button>
                    <button className="btn btn-outline" onClick={() => remove(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
