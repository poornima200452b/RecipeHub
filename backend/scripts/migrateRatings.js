require("dotenv").config();

const mongoose = require("mongoose");
const Rating = require("../models/ratingModel");
const Recipe = require("../models/recipeModel");
const { addOrUpdateRecipeRating } = require("../utils/recipeRatings");

async function migrateRatings() {
  await mongoose.connect(process.env.MONGODB_URI);

  const legacyRatings = await Rating.find().sort({ createdAt: 1, _id: 1 });
  let migrated = 0;
  let skipped = 0;

  for (const legacyRating of legacyRatings) {
    const recipe = await Recipe.findById(legacyRating.recipe);

    if (!recipe) {
      skipped += 1;
      continue;
    }

    const alreadyPresent = (recipe.ratings || []).some(
      (rating) => String(rating.user) === String(legacyRating.user)
    );

    if (alreadyPresent) {
      skipped += 1;
      continue;
    }

    addOrUpdateRecipeRating(
      recipe,
      legacyRating.user,
      legacyRating.rating
    );
    await recipe.save();
    migrated += 1;
  }

  console.log(
    `Rating migration complete: ${migrated} migrated, ${skipped} skipped.`
  );
  console.log(
    "The legacy ratings collection was left unchanged."
  );
}

migrateRatings()
  .catch((error) => {
    console.error("Rating migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
