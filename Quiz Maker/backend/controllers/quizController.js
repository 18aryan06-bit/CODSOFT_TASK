// const mongoose = require("mongoose");
// const Quiz = require("../models/Quiz");

// function validateQuiz(body) {
//   if (!body || typeof body !== "object") return "Request body is required.";
//   const { title, description = "", category, questions } = body;
//   if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) return "Title must be 3–120 characters.";
//   if (typeof description !== "string" || description.length > 1000) return "Description must be at most 1000 characters.";
//   if (typeof category !== "string" || !category.trim() || category.trim().length > 60) return "Category is required and must be at most 60 characters.";
//   if (!Array.isArray(questions) || questions.length < 1 || questions.length > 100) return "Add between 1 and 100 questions.";
//   for (let i = 0; i < questions.length; i++) {
//     const q = questions[i];
//     if (!q || typeof q.questionText !== "string" || !q.questionText.trim() || q.questionText.length > 1000) return `Question ${i + 1} needs valid text.`;
//     if (!Array.isArray(q.options) || q.options.length !== 4 || !q.options.every((o) => typeof o === "string" && o.trim() && o.length <= 300)) return `Question ${i + 1} must have four non-empty options (max 300 characters each).`;
//     if (!Number.isInteger(q.correctAnswerIndex) || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) return `Question ${i + 1} has an invalid correct answer.`;
//   }
//   return null;
// }

// function safeQuizInput(body) {
//   return {
//     title: body.title.trim(),
//     description: (body.description || "").trim(),
//     category: body.category.trim(),
//     questions: body.questions.map((q) => ({
//       questionText: q.questionText.trim(),
//       options: q.options.map((o) => o.trim()),
//       correctAnswerIndex: q.correctAnswerIndex,
//     })),
//   };
// }

// exports.getQuizzes = async (req, res) => {
//   try {
//     const pageValue = Number.parseInt(req.query.page, 10);
//     const limitValue = Number.parseInt(req.query.limit, 10);
//     const page = Number.isFinite(pageValue) ? Math.max(1, pageValue) : 1;
//     const limit = Number.isFinite(limitValue) ? Math.min(50, Math.max(1, limitValue)) : 12;
//     const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
//     const filter = {};
//     if (search) {
//       const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       filter.$or = [{ title: new RegExp(escaped, "i") }, { category: new RegExp(escaped, "i") }];
//     }
//     const [docs, total] = await Promise.all([
//       Quiz.find(filter).select("title description category createdBy questions createdAt")
//         .populate("createdBy", "name").sort({ createdAt: -1 })
//         .skip((page - 1) * limit).limit(limit).lean(),
//       Quiz.countDocuments(filter),
//     ]);
//     res.json({
//       quizzes: docs.map((q) => ({
//         _id: q._id, title: q.title, description: q.description, category: q.category,
//         questionCount: q.questions.length, createdAt: q.createdAt,
//         createdBy: q.createdBy ? { id: q.createdBy._id, name: q.createdBy.name } : null,
//       })),
//       pagination: { page, limit, total, pages: Math.ceil(total / limit) },
//     });
//   } catch (error) {
//     console.error("Get quizzes error:", error);
//     res.status(500).json({ message: "Unable to load quizzes." });
//   }
// };

// exports.getQuizById = async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid quiz ID." });
//     const quiz = await Quiz.findById(req.params.id)
//       .select("-questions.correctAnswerIndex").populate("createdBy", "name").lean();
//     if (!quiz) return res.status(404).json({ message: "Quiz not found." });
//     res.json({ quiz });
//   } catch (error) {
//     console.error("Get quiz error:", error);
//     res.status(500).json({ message: "Unable to load this quiz." });
//   }
// };

// exports.createQuiz = async (req, res) => {
//   try {
//     const validationError = validateQuiz(req.body);
//     if (validationError) return res.status(400).json({ message: validationError });
//     const input = safeQuizInput(req.body);
//     const quiz = await Quiz.create({ ...input, createdBy: req.user.id });
//     res.status(201).json({
//       message: "Quiz created successfully.",
//       quiz: { _id: quiz._id, title: quiz.title, description: quiz.description, category: quiz.category, questionCount: quiz.questions.length, createdAt: quiz.createdAt },
//     });
//   } catch (error) {
//     if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
//     console.error("Create quiz error:", error);
//     res.status(500).json({ message: "Unable to create quiz." });
//   }
// };

// exports.submitQuiz = async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid quiz ID." });
//     const { answers } = req.body || {};
//     if (!Array.isArray(answers) || !answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3)) {
//       return res.status(400).json({ message: "Answers must be option indexes from 0 to 3." });
//     }
//     const quiz = await Quiz.findById(req.params.id).lean();
//     if (!quiz) return res.status(404).json({ message: "Quiz not found." });
//     if (answers.length !== quiz.questions.length) return res.status(400).json({ message: "Submit one answer for every question." });

//     let score = 0;
//     const breakdown = quiz.questions.map((q, index) => {
//       const selectedAnswerIndex = answers[index];
//       const isCorrect = selectedAnswerIndex === q.correctAnswerIndex;
//       if (isCorrect) score++;
//       return {
//         questionId: q._id,
//         questionText: q.questionText,
//         options: q.options,
//         selectedAnswerIndex,
//         correctAnswerIndex: q.correctAnswerIndex,
//         isCorrect,
//       };
//     });
//     res.json({
//       message: "Quiz submitted successfully.",
//       result: {
//         quizId: quiz._id, title: quiz.title, score, total: quiz.questions.length,
//         percentage: Math.round((score / quiz.questions.length) * 100), breakdown,
//       },
//     });
//   } catch (error) {
//     console.error("Submit quiz error:", error);
//     res.status(500).json({ message: "Unable to submit quiz." });
//   }
// };

const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

function validateQuiz(body) {
  if (!body || typeof body !== "object") return "Request body is required.";
  const { title, description = "", category, questions } = body;
  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) return "Title must be 3–120 characters.";
  if (typeof description !== "string" || description.length > 1000) return "Description must be at most 1000 characters.";
  if (typeof category !== "string" || !category.trim() || category.trim().length > 60) return "Category is required and must be at most 60 characters.";
  if (!Array.isArray(questions) || questions.length < 1 || questions.length > 100) return "Add between 1 and 100 questions.";
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q || typeof q.questionText !== "string" || !q.questionText.trim() || q.questionText.length > 1000) return `Question ${i + 1} needs valid text.`;
    if (!Array.isArray(q.options) || q.options.length !== 4 || !q.options.every((o) => typeof o === "string" && o.trim() && o.length <= 300)) return `Question ${i + 1} must have four non-empty options (max 300 characters each).`;
    if (!Number.isInteger(q.correctAnswerIndex) || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) return `Question ${i + 1} has an invalid correct answer.`;
  }
  return null;
}

function safeQuizInput(body) {
  return {
    title: body.title.trim(),
    description: (body.description || "").trim(),
    category: body.category.trim(),
    questions: body.questions.map((q) => ({
      questionText: q.questionText.trim(),
      options: q.options.map((o) => o.trim()),
      correctAnswerIndex: q.correctAnswerIndex,
    })),
  };
}

exports.getQuizzes = async (req, res) => {
  try {
    const pageValue = Number.parseInt(req.query.page, 10);
    const limitValue = Number.parseInt(req.query.limit, 10);
    const page = Number.isFinite(pageValue) ? Math.max(1, pageValue) : 1;
    const limit = Number.isFinite(limitValue) ? Math.min(50, Math.max(1, limitValue)) : 12;
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";

    // Automatic fallback: Agar database bilkul khali hai aur koi search filter nahi hai
    const totalCheck = await Quiz.countDocuments({});
    if (totalCheck === 0 && !search) {
      const defaultQuizzes = [
        {
          title: "JavaScript Basics",
          description: "Test your fundamental JavaScript knowledge with variables and functions.",
          category: "Programming",
          questions: [
            {
              questionText: "Which keyword declares a block-scoped variable?",
              options: ["var", "let", "define", "static"],
              correctAnswerIndex: 1
            },
            {
              questionText: "Inside which HTML element do we put the JavaScript?",
              options: ["<script>", "<js>", "<javascript>", "<scripting>"],
              correctAnswerIndex: 0
            }
          ]
        },
        {
          title: "React Fundamentals",
          description: "Check your skills on components, state, and props in React.js.",
          category: "Web Development",
          questions: [
            {
              questionText: "What hook is used to manage state in a functional component?",
              options: ["useEffect", "useState", "useContext", "useRef"],
              correctAnswerIndex: 1
            }
          ]
        }
      ];
      await Quiz.insertMany(defaultQuizzes);
    }

    const filter = {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: new RegExp(escaped, "i") }, { category: new RegExp(escaped, "i") }];
    }
    const [docs, total] = await Promise.all([
      Quiz.find(filter).select("title description category createdBy questions createdAt")
        .populate("createdBy", "name").sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(limit).lean(),
      Quiz.countDocuments(filter),
    ]);
    res.json({
      quizzes: docs.map((q) => ({
        _id: q._id, title: q.title, description: q.description, category: q.category,
        questionCount: q.questions.length, createdAt: q.createdAt,
        createdBy: q.createdBy ? { id: q.createdBy._id, name: q.createdBy.name } : null,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ message: "Unable to load quizzes." });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid quiz ID." });
    const quiz = await Quiz.findById(req.params.id)
      .select("-questions.correctAnswerIndex").populate("createdBy", "name").lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });
    res.json({ quiz });
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ message: "Unable to load this quiz." });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const validationError = validateQuiz(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const input = safeQuizInput(req.body);
    const quiz = await Quiz.create({ ...input, createdBy: req.user.id });
    res.status(201).json({
      message: "Quiz created successfully.",
      quiz: { _id: quiz._id, title: quiz.title, description: quiz.description, category: quiz.category, questionCount: quiz.questions.length, createdAt: quiz.createdAt },
    });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    console.error("Create quiz error:", error);
    res.status(500).json({ message: "Unable to create quiz." });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid quiz ID." });
    const { answers } = req.body || {};
    if (!Array.isArray(answers) || !answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3)) {
      return res.status(400).json({ message: "Answers must be option indexes from 0 to 3." });
    }
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });
    if (answers.length !== quiz.questions.length) return res.status(400).json({ message: "Submit one answer for every question." });

    let score = 0;
    const breakdown = quiz.questions.map((q, index) => {
      const selectedAnswerIndex = answers[index];
      const isCorrect = selectedAnswerIndex === q.correctAnswerIndex;
      if (isCorrect) score++;
      return {
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        selectedAnswerIndex,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
      };
    });
    res.json({
      message: "Quiz submitted successfully.",
      result: {
        quizId: quiz._id, title: quiz.title, score, total: quiz.questions.length,
        percentage: Math.round((score / quiz.questions.length) * 100), breakdown,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Unable to submit quiz." });
  }
};