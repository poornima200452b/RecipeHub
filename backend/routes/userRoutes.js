
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    saveRecipe,
    getSavedRecipes
} = require("../controllers/userController");

// Save a recipe
router.post("/saved-recipes/:recipeId", protect, saveRecipe);

// View saved recipes
router.get("/saved-recipes", protect, getSavedRecipes);

module.exports = router;
