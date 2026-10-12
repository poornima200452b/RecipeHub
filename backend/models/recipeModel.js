
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    ingredients: {
      type: [String],
      required: true,
    },

    instructions: {
      type: [String],
      required: true,
    },

    preparationTime: {
      type: Number,
      required: true,
      min: 1,
    },

    cookingTime: {
      type: Number,
      required: true,
      min: 1,
    },

    servings: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    
    views: {
        type: Number,
        default: 0,
        min: 0,
    },

    

    ratings: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    ],



    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
