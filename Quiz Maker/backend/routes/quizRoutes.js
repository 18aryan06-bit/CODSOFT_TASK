const express = require("express");
const { getQuizzes, getQuizById, createQuiz, submitQuiz } = require("../controllers/quizController");
const auth = require("../middleware/auth");

const router = express.Router();
router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.post("/", auth, createQuiz);
router.post("/:id/submit", auth, submitQuiz);

module.exports = router;
