import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { env } from "../config/env";
import { registerSchema, loginSchema } from "../validators/auth";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, passwordHash, role: "citizen" });
    res.status(201).json({ _id: user._id, email: user.email });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const access = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      env.jwtAccessSecret,
      { expiresIn: "15m" }
    );
    const refresh = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      env.jwtRefreshSecret,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken: access,
      refreshToken: refresh,
      user: { _id: user._id, role: user.role, email: user.email },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken)
      return res.status(400).json({ message: "Missing refresh token" });
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as any;
    const access = jwt.sign(
      { _id: payload._id, role: payload.role },
      env.jwtAccessSecret,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: access });
  } catch (e) {
    next(e);
  }
});

router.get("/me", async (req, res) => {
  // This route is typically protected, but you can also return a 200 if token is verified on client
  res.status(200).json({ ok: true });
});

export default router;
