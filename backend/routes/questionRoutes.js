
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createQuestion,
    getRecipeQuestions
} = require("../controllers/questionController");

// Ask a question (login required)
router.post("/:recipeId", protect, createQuestion);

// View questions (public)
router.get("/:recipeId", getRecipeQuestions);

module.exports = router;
