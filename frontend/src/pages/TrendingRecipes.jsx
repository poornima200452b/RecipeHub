
import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

function TrendingRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrendingRecipes() {
      try {
        const response = await API.get("/api/recipes/trending");
        setRecipes(response.data);
      } catch (err) {
        setError("Unable to load trending recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingRecipes();
  }, []);

  return (
    <main className="trending-page">
      <section className="trending-heading">
        <p className="eyebrow">POPULAR ON RECIPEHUB</p>
        <h1>🔥 Trending Recipes</h1>
        <p>Discover delicious recipes from our chefs.</p>
      </section>

      {loading && <p>Loading trending recipes...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p>No trending recipes available yet.</p>
      )}

      {!loading && !error && recipes.length > 0 && (
        <section className="trending-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  );
}

export default TrendingRecipes;
