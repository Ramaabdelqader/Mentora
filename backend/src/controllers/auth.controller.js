import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/index.js";

dotenv.config();

// Convert user to safe public form
const toPublic = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

// Helper for signing JWT
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

/**
 * @desc Register a new user (public route)
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    let { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    name = String(name).trim();
    email = String(email).trim().toLowerCase();

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Rely on model hook to hash the password automatically
    const user = await User.create({ name, email, password, role: "student" });

    const token = signToken(user);
    res.status(201).json({ token, user: toPublic(user) });
  } catch (e) {
    console.error("Register error:", e);
    next(e);
  }
}

/**
 * @desc Login existing user
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare plain text password with hashed password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: toPublic(user),
    });
  } catch (e) {
    console.error("Login error:", e);
    next(e);
  }
}

/**
 * @desc Get current logged-in user info
 * GET /api/auth/me
 * Requires auth middleware
 */
export async function me(req, res, next) {
  try {
    const fresh = await User.findByPk(req.user.id);
    if (!fresh) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(toPublic(fresh));
  } catch (e) {
    next(e);
  }
}
