const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

function auth(req, res, next) {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in to continue." });
  }
  try {
    const token = header.slice(7).trim();
    if (!token) return res.status(401).json({ message: "Authentication token missing." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json({ message: "Invalid authentication token." });
    }
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid authentication token.",
    });
  }
}

module.exports = auth;
