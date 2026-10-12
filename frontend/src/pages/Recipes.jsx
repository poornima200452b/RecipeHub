
import { useEffect, useState } from "react";
import API from "../api/axios";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recipesPerPage = 5;

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/api/recipes?page=${currentPage}&limit=${recipesPerPage}`
        );

        setRecipes(response.data.recipes || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Unable to load recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main>
      <h1>Explore Recipes 🍲</h1>
      <p>Discover delicious dishes for every craving.</p>

      {loading && <p>Loading recipes...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p>No recipes available yet. Be the first to add one!</p>
      )}

      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="recipes-list">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              ← Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => goToPage(page)}
                disabled={currentPage === page || loading}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next →
            </button>
          </div>

          <p>
            Page {currentPage} of {totalPages}
          </p>
        </>
      )}
    </main>
  );
}

export default Recipes;
