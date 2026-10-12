
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createReview,
    getRecipeReviews
} = require("../controllers/reviewController");

// Submit a review (login required)
router.post("/:recipeId", protect, createReview);

// View reviews for a recipe (public)
router.get("/:recipeId", getRecipeReviews);

module.exports = router;
