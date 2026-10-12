
const Review = require("../models/reviewModel");
const Recipe = require("../models/recipeModel");

// Add a review to a recipe
const createReview = async (req, res) => {
    try {
        const { comment } = req.body;
        const { recipeId } = req.params;

        if (typeof comment !== "string" || comment.trim().length < 3) {
            return res.status(400).json({
                message: "Review must contain at least 3 characters"
            });
        }

        if (comment.trim().length > 1000) {
            return res.status(400).json({
                message: "Review cannot exceed 1000 characters"
            });
        }

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        const review = await Review.create({
            recipe: recipeId,
            user: req.user.id,
            comment: comment.trim()
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to submit review",
            error: error.message
        });
    }
};

// Get all reviews for a recipe
const getRecipeReviews = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        const reviews = await Review.find({ recipe: recipeId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message
        });
    }
};

module.exports = {
    createReview,
    getRecipeReviews
};
