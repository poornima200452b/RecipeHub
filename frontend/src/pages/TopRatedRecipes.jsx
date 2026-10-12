
import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

function TopRatedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopRatedRecipes = async () => {
      try {
        const response = await API.get("/api/recipes/top-rated");
        setRecipes(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load top-rated recipes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedRecipes();
  }, []);

  if (loading) return <p>Loading top-rated recipes...</p>;

  if (error) return <p>{error}</p>;

  return (
    <main className="recipes-page">
      <h1>Top-Rated Recipes ⭐</h1>
      <p>Discover recipes loved by our users.</p>

      {recipes.length === 0 ? (
        <p>No rated recipes yet. Be the first to rate a recipe!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <article key={recipe._id}>
              <RecipeCard recipe={recipe} />
              <p>
                ⭐ {recipe.averageRating.toFixed(1)} / 5
                {" "}({recipe.totalRatings}{" "}
                {recipe.totalRatings === 1 ? "rating" : "ratings"})
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default TopRatedRecipes;
