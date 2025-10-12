import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();

const toPublic = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

function signToken(u) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign(
    { id: u.id, email: u.email, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res, next) {
  try {
    let { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    name = String(name).trim();
    email = String(email).trim().toLowerCase();

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    // Create user; model hook will hash password
    const user = await User.create({ name, email, password });

    const token = signToken(user);
    return res.status(201).json({ token, user: toPublic(user) });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    let { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    email = String(email).trim().toLowerCase();

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({ token, user: toPublic(user) });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const fresh = await User.findByPk(req.user.id);
    if (!fresh) return res.status(404).json({ message: "User not found" });
    return res.json(toPublic(fresh));
  } catch (e) {
    next(e);
  }
}
