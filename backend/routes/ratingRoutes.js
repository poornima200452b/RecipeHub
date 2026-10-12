
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    rateRecipe,
    getRecipeRating
} = require("../controllers/ratingController");

// Submit or update a rating (login required)
router.post("/:recipeId", protect, rateRecipe);

// Get the average rating (public)
router.get("/:recipeId", getRecipeRating);

module.exports = router;
