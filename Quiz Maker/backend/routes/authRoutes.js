const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login } = require("../controllers/authController");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
