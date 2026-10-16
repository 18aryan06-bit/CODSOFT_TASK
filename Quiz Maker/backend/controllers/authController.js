const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    issuer: "quiz-web-app",
    audience: "quiz-web-client",
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2 || cleanName.length > 60) {
      return res.status(400).json({ message: "Name must be 2–60 characters." });
    }
    if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Password must be 8–128 characters." });
    }
    const existing = await User.findOne({ email: cleanEmail }).lean();
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: await bcrypt.hash(password, 12),
    });
    return res.status(201).json({
      message: "Account created successfully.",
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    console.error("Register error:", error);
    return res.status(500).json({ message: "Could not create your account." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    return res.json({
      message: "Login successful.",
      token: signToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Could not log in right now." });
  }
};
