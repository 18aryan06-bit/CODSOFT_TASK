require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI must be configured.");

app.disable("x-powered-by");
app.use(helmet());

// CORS configuration ko fix kar diya gaya hai taaki frontend easily connect ho sake
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}));

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));

app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  if (err.type === "entity.too.large") return res.status(413).json({ message: "Request body is too large." });
  if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ message: "Invalid JSON body." });
  res.status(500).json({ message: "Internal server error." });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`Quiz API listening on http://localhost:${PORT}`));
}
start().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});