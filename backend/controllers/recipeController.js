
const Recipe = require("../models/recipeModel");
const {
  addOrUpdateRecipeRating,
  getRatingSummary,
  parseRating,
} = require("../utils/recipeRatings");

// Create a recipe
const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      servings,
      image,
    } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      servings,
      image: image || "",
      chef: req.user.id,
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create recipe",
      error: error.message,
    });
  }
};

// Get all recipes with search, filters, and pagination
const getAllRecipes = async (req, res) => {
  try {
    const { search, maxPreparationTime, maxCookingTime } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (maxPreparationTime !== undefined) {
      const prepTime = Number(maxPreparationTime);

      if (!Number.isFinite(prepTime) || prepTime < 1) {
        return res.status(400).json({
          message: "maxPreparationTime must be a positive number",
        });
      }

      filter.preparationTime = { $lte: prepTime };
    }

    if (maxCookingTime !== undefined) {
      const cookTime = Number(maxCookingTime);

      if (!Number.isFinite(cookTime) || cookTime < 1) {
        return res.status(400).json({
          message: "maxCookingTime must be a positive number",
        });
      }

      filter.cookingTime = { $lte: cookTime };
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 6)
    );
    const skip = (page - 1) * limit;

    const [recipes, totalRecipes] = await Promise.all([
      Recipe.find(filter)
        .populate("chef", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recipes",
      error: error.message,
    });
  }
};

// Get one recipe and increment its view count
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true }
    ).populate("chef", "name");

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json(recipe);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    res.status(500).json({
      message: "Failed to fetch recipe",
      error: error.message,
    });
  }
};

// Rate a recipe
const rateRecipe = async (req, res) => {
  try {
    const value = parseRating(req.body.rating);

    if (value === null) {
      return res.status(400).json({
        message: "Rating must be a whole number between 1 and 5",
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    addOrUpdateRecipeRating(recipe, req.user.id, value);
    await recipe.save();

    res.status(200).json({
      message: "Rating submitted successfully",
      ...getRatingSummary(recipe.ratings),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to rate recipe",
      error: error.message,
    });
  }
};

// Get trending recipes based on views
const getTrendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ views: -1, createdAt: -1 })
      .limit(6)
      .populate("chef", "name");

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trending recipes",
      error: error.message,
    });
  }
};

// Get top-rated recipes
const getTopRatedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("chef", "name");

    const topRatedRecipes = recipes
      .map((recipe) => {
        return {
          ...recipe.toObject(),
          ...getRatingSummary(recipe.ratings),
        };
      })
      .filter((recipe) => recipe.totalRatings > 0)
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }

        return b.totalRatings - a.totalRatings;
      })
      .slice(0, 6);

    res.status(200).json(topRatedRecipes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch top-rated recipes",
      error: error.message,
    });
  }
};

// Find recipes using available ingredients
const findRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one ingredient",
      });
    }

    const searchIngredients = ingredients
      .filter((item) => typeof item === "string")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (searchIngredients.length === 0) {
      return res.status(400).json({
        message: "Please enter valid ingredients",
      });
    }

    if (searchIngredients.length > 30) {
      return res.status(400).json({
        message: "Please enter no more than 30 ingredients",
      });
    }

    // Escape regular-expression characters supplied by the user.
    const escapedIngredients = searchIngredients.map((ingredient) =>
      ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );

    // Match at least one supplied ingredient.
    const recipes = await Recipe.find({
      ingredients: {
        $in: escapedIngredients.map(
          (ingredient) => new RegExp(ingredient, "i")
        ),
      },
    }).populate("chef", "name");

    // Rank recipes by the number of matching ingredients.
    const matchedRecipes = recipes
      .map((recipe) => {
        const recipeIngredients = (recipe.ingredients || []).map(
          (item) => item.toLowerCase()
        );

        const matchedIngredients = searchIngredients.filter((searchItem) =>
          recipeIngredients.some((recipeItem) =>
            recipeItem.includes(searchItem)
          )
        );

        return {
          ...recipe.toObject(),
          matchedIngredients,
          matchCount: matchedIngredients.length,
          totalSearchIngredients: searchIngredients.length,
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount);

    res.status(200).json({
      count: matchedRecipes.length,
      recipes: matchedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to find recipes",
      error: error.message,
    });
  }
};

// Update a recipe owned by the logged-in chef
const updateRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      servings,
      image,
    } = req.body;

    const recipe = await Recipe.findOne({
      _id: req.params.id,
      chef: req.user.id,
    });

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found or you are not authorized to edit it",
      });
    }

    if (title !== undefined) recipe.title = title;
    if (description !== undefined) recipe.description = description;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (instructions !== undefined) recipe.instructions = instructions;
    if (preparationTime !== undefined) {
      recipe.preparationTime = preparationTime;
    }
    if (cookingTime !== undefined) recipe.cookingTime = cookingTime;
    if (servings !== undefined) recipe.servings = servings;
    if (image !== undefined) recipe.image = image;

    await recipe.save();

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update recipe",
      error: error.message,
    });
  }
};

// Delete a recipe owned by the logged-in chef
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      chef: req.user.id,
    });

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found or you are not authorized to delete it",
      });
    }

    await recipe.deleteOne();

    res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete recipe",
      error: error.message,
    });
  }
};

// Export all controller functions
module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getTrendingRecipes,
  getTopRatedRecipes,
  rateRecipe,
  findRecipesByIngredients,
  updateRecipe,
  deleteRecipe,
};
