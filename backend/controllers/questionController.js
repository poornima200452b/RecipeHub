
const Question = require("../models/questionModel");
const Recipe = require("../models/recipeModel");

// Ask a question about a recipe
const createQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const { recipeId } = req.params;

        if (
            typeof question !== "string" ||
            question.trim().length < 5
        ) {
            return res.status(400).json({
                message: "Question must contain at least 5 characters"
            });
        }

        if (question.trim().length > 500) {
            return res.status(400).json({
                message: "Question cannot exceed 500 characters"
            });
        }

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        const newQuestion = await Question.create({
            recipe: recipeId,
            user: req.user.id,
            question: question.trim()
        });

        res.status(201).json({
            message: "Question submitted successfully",
            question: newQuestion
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to submit question",
            error: error.message
        });
    }
};

// View questions for a recipe
const getRecipeQuestions = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        const questions = await Question.find({
            recipe: recipeId
        })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch questions",
            error: error.message
        });
    }
};

module.exports = {
    createQuestion,
    getRecipeQuestions
};
