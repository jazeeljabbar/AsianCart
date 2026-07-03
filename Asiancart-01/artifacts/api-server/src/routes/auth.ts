import { Router } from "express";
import crypto from "crypto";
import {
  getUserByEmail,
  saveUser,
  getUserById,
  type User,
} from "../lib/db-store.js";

const router = Router();

// Simple token store (in-memory — fine for dev)
const sessions = new Map<string, string>(); // token -> userId

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password: string): string {
  // Simple hash for dev — in production use bcrypt
  return crypto.createHash("sha256").update(password + "asiancart_salt").digest("hex");
}

// POST /api/auth/register
router.post("/auth/register", (req, res) => {
  const { email, password, name, phone } = req.body as {
    email: string;
    password: string;
    name: string;
    phone?: string;
  };

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password and name are required" });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    role: "customer",
    name: name.trim(),
    phone: phone ?? "",
    createdAt: new Date().toISOString(),
  };

  saveUser(newUser);

  const token = generateToken();
  sessions.set(token, newUser.id);

  return res.status(201).json({
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    token,
  });
});

// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Support plain-text passwords from db.json seed AND hashed ones
  const hashed = hashPassword(password);
  const valid = user.passwordHash === password || user.passwordHash === hashed;
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken();
  sessions.set(token, user.id);

  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    token,
  });
});

// GET /api/auth/me  (Authorization: Bearer <token>)
router.get("/auth/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  const userId = sessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
  const user = getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
  });
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    sessions.delete(auth.slice(7));
  }
  return res.json({ success: true });
});

// PUT /api/auth/profile  (Authorization: Bearer <token>)
router.put("/auth/profile", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  const userId = sessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  const { name, phone, currentPassword, newPassword } = req.body as {
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // If changing password, verify current password first
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required to set a new password" });
    }
    const hashed = hashPassword(currentPassword);
    const valid = user.passwordHash === currentPassword || user.passwordHash === hashed;
    if (!valid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    user.passwordHash = hashPassword(newPassword);
  }

  if (name?.trim()) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();

  saveUser(user);

  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
  });
});

export { sessions };
export default router;
