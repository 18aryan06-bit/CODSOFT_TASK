const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true, maxlength: 1000 },
  options: {
    type: [{ type: String, trim: true, maxlength: 300 }],
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((v) => typeof v === "string" && v.trim().length > 0),
      message: "Each question must have exactly four non-empty options.",
    },
  },
  correctAnswerIndex: {
    type: Number, required: true, min: 0, max: 3,
    validate: { validator: Number.isInteger, message: "Answer index must be an integer from 0 to 3." },
  },
}, { _id: true });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
  questions: {
    type: [questionSchema], required: true,
    validate: { validator: (arr) => Array.isArray(arr) && arr.length >= 1 && arr.length <= 100, message: "A quiz needs 1 to 100 questions." },
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

quizSchema.index({ title: "text", category: "text" });

module.exports = mongoose.model("Quiz", quizSchema);
