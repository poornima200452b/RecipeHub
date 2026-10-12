
const express = require("express");
const router = express.Router();

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getTrendingRecipes,
  getTopRatedRecipes,
  rateRecipe,
  findRecipesByIngredients,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create a recipe — chef only
router.post("/", protect, authorizeRoles("chef"), createRecipe);

// Get all recipes with pagination
router.get("/", getAllRecipes);

// Get trending recipes
router.get("/trending", getTrendingRecipes);

// Get top-rated recipes
router.get("/top-rated", getTopRatedRecipes);

// Find recipes by available ingredients
router.post("/find-by-ingredients", findRecipesByIngredients);

// Rate a recipe — logged-in users
router.post("/:id/rating", protect, rateRecipe);

// Update a recipe — chef only
router.put("/:id", protect, authorizeRoles("chef"), updateRecipe);

// Delete a recipe — chef only
router.delete("/:id", protect, authorizeRoles("chef"), deleteRecipe);

// Get one recipe by ID
router.get("/:id", getRecipeById);

module.exports = router;
