
import { useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

function IngredientFinder() {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const findRecipes = async (event) => {
    event.preventDefault();

    const ingredients = ingredientsInput
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

    if (ingredients.length === 0) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setError("");
    setRecipes([]);
    setSearched(true);

    try {
      const response = await API.post(
        "/api/recipes/find-by-ingredients",
        { ingredients }
      );

      setRecipes(response.data.recipes || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to find recipes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ingredient-finder">
      <h1>Ingredient Finder 🥕</h1>
      <p>
        Tell us what ingredients you have, and discover recipes
        you can make!
      </p>

      <form onSubmit={findRecipes}>
        <label htmlFor="ingredients">
          Enter ingredients separated by commas
        </label>

        <textarea
          id="ingredients"
          value={ingredientsInput}
          onChange={(event) =>
            setIngredientsInput(event.target.value)
          }
          placeholder="e.g. paneer, onion, tomato"
          rows={3}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Finding recipes..." : "Find Recipes"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading && <p>Searching your ingredients...</p>}

      {!loading && searched && !error && recipes.length === 0 && (
        <p>No matching recipes found. Try different ingredients.</p>
      )}

      {!loading && recipes.length > 0 && (
        <section>
          <h2>Recipes You Can Try</h2>

          <div className="recipes-list">
            {recipes.map((recipe) => (
              <article key={recipe._id}>
                <RecipeCard recipe={recipe} />

                <p>
                  <strong>
                    Matching ingredients: {recipe.matchCount}
                  </strong>
                  {" / "}
                  {recipe.totalSearchIngredients}
                </p>

                <p>
                  Found: {(recipe.matchedIngredients || []).join(", ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default IngredientFinder;
