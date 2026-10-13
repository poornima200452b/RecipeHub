
const Recipe = require("../models/recipeModel");
const {
    addOrUpdateRecipeRating,
    getRatingSummary,
    parseRating
} = require("../utils/recipeRatings");

// Add or update a rating
const rateRecipe = async (req, res) => {
    try {
        const rating = parseRating(req.body.rating);
        const { recipeId } = req.params;

        if (rating === null) {
            return res.status(400).json({
                message: "Rating must be a whole number from 1 to 5"
            });
        }

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        addOrUpdateRecipeRating(recipe, req.user.id, rating);
        await recipe.save();

        res.status(200).json({
            message: "Rating submitted successfully",
            rating: {
                recipe: recipe._id,
                user: req.user.id,
                rating
            },
            ...getRatingSummary(recipe.ratings)
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid recipe ID"
            });
        }

        res.status(500).json({
            message: "Failed to submit rating",
            error: error.message
        });
    }
};

// Get a recipe's average rating
const getRecipeRating = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        res.status(200).json({
            recipeId,
            ...getRatingSummary(recipe.ratings)
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid recipe ID"
            });
        }

        res.status(500).json({
            message: "Failed to fetch rating",
            error: error.message
        });
    }
};

module.exports = {
    rateRecipe,
    getRecipeRating
};
