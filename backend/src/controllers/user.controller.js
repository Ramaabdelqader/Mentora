import { User } from "../models/index.js";

export async function listUsers(_req, res, next) {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email", "role"] });
    res.json(users);
  } catch (e) { next(e); }
}

export async function setRole(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user id" });

    const { role } = req.body;
    const allowed = ["student", "instructor", "admin"];
    if (!allowed.includes(role)) return res.status(400).json({ message: "Invalid role" });

    const u = await User.findByPk(id);
    if (!u) return res.status(404).json({ message: "Not found" });
    await u.update({ role });
    res.json({ id: u.id, role: u.role });
  } catch (e) { next(e); }
}

export async function resetPassword(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user id" });

    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password required" });
    const u = await User.findByPk(id);
    if (!u) return res.status(404).json({ message: "Not found" });

    // Update password directly; model hook will hash
    u.password = password;
    await u.save();

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user id" });

    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
