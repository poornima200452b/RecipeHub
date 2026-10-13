function parseRating(input) {
  if (typeof input !== "number" && typeof input !== "string") {
    return null;
  }

  if (typeof input === "string" && input.trim() === "") {
    return null;
  }

  const rating = Number(input);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
    ? rating
    : null;
}

function addOrUpdateRecipeRating(recipe, userId, value) {
  if (!Array.isArray(recipe.ratings)) {
    recipe.ratings = [];
  }

  const existingRating = recipe.ratings.find(
    (rating) => String(rating.user) === String(userId)
  );

  if (existingRating) {
    existingRating.value = value;
  } else {
    recipe.ratings.push({ user: userId, value });
  }
}

function getRatingSummary(ratings = []) {
  if (!Array.isArray(ratings)) {
    ratings = [];
  }

  const totalRatings = ratings.length;
  const average = totalRatings
    ? ratings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings
    : 0;

  return {
    averageRating: Number(average.toFixed(1)),
    totalRatings,
  };
}

module.exports = {
  addOrUpdateRecipeRating,
  getRatingSummary,
  parseRating,
};
