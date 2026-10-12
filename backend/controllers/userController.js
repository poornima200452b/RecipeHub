
const User = require("../models/userModel");

// Save a recipe to the user's favorites
const saveRecipe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const recipeId = req.params.recipeId;

        if (user.savedRecipes.some(id => id.toString() === recipeId)) {
            return res.status(409).json({
                message: "Recipe already saved"
            });
        }

        user.savedRecipes.push(recipeId);
        await user.save();

        res.status(200).json({
            message: "Recipe saved successfully",
            savedRecipes: user.savedRecipes
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to save recipe",
            error: error.message
        });
    }
};

// View the user's saved recipes
const getSavedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("savedRecipes");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch saved recipes",
            error: error.message
        });
    }
};

module.exports = {
    saveRecipe,
    getSavedRecipes
};
