const assert = require("node:assert/strict");
const test = require("node:test");
const {
  addOrUpdateRecipeRating,
  getRatingSummary,
  parseRating,
} = require("../utils/recipeRatings");

test("parseRating accepts whole number ratings from 1 through 5", () => {
  assert.equal(parseRating(1), 1);
  assert.equal(parseRating("5"), 5);
});

test("parseRating rejects values outside the supported range", () => {
  for (const value of [0, 6, 2.5, "", "abc", null, true]) {
    assert.equal(parseRating(value), null);
  }
});

test("getRatingSummary returns zero values for unrated recipes", () => {
  assert.deepEqual(getRatingSummary(), {
    averageRating: 0,
    totalRatings: 0,
  });
  assert.deepEqual(getRatingSummary(null), {
    averageRating: 0,
    totalRatings: 0,
  });
});

test("getRatingSummary calculates and rounds the average", () => {
  assert.deepEqual(
    getRatingSummary([{ value: 4 }, { value: 5 }, { value: 3 }]),
    { averageRating: 4, totalRatings: 3 }
  );
  assert.deepEqual(
    getRatingSummary([{ value: 4 }, { value: 5 }]),
    { averageRating: 4.5, totalRatings: 2 }
  );
});

test("addOrUpdateRecipeRating keeps one embedded rating per user", () => {
  const recipe = {
    ratings: [{ user: "user-1", value: 2 }],
  };

  addOrUpdateRecipeRating(recipe, "user-1", 5);
  addOrUpdateRecipeRating(recipe, "user-2", 4);

  assert.deepEqual(recipe.ratings, [
    { user: "user-1", value: 5 },
    { user: "user-2", value: 4 },
  ]);
});
