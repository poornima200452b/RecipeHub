
const Rating = require("../models/ratingModel");
const Recipe = require("../models/recipeModel");

// Add or update a rating
const rateRecipe = async (req, res) => {
    try {
        const { rating } = req.body;
        const { recipeId } = req.params;

        if (
            rating === undefined ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
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

        const savedRating = await Rating.findOneAndUpdate(
            {
                recipe: recipeId,
                user: req.user.id
            },
            {
                rating
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            message: "Rating submitted successfully",
            rating: savedRating
        });
    } catch (error) {
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

        const result = await Rating.aggregate([
            {
                $match: {
                    recipe: recipe._id
                }
            },
            {
                $group: {
                    _id: "$recipe",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            recipeId,
            averageRating: result.length
                ? Number(result[0].averageRating.toFixed(1))
                : 0,
            totalRatings: result.length
                ? result[0].totalRatings
                : 0
        });
    } catch (error) {
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
