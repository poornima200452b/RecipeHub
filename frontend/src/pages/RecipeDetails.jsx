
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = user?.id || user?._id;

  // Check whether the logged-in Chef owns this recipe.
  const chefId =
    typeof recipe?.chef === "object"
      ? recipe?.chef?._id
      : recipe?.chef;

  const isOwner =
    user?.role === "chef" &&
    userId &&
    chefId &&
    String(userId) === String(chefId);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/api/recipes/${id}`);
        const data = response.data;

        setRecipe(data);

        const ratings = data.ratings || [];
        const total = ratings.length;
        const average = total
          ? ratings.reduce((sum, item) => sum + item.value, 0) / total
          : 0;

        setAverageRating(Number(average.toFixed(1)));
        setTotalRatings(total);

        const currentUserId = user?.id || user?._id;
        const previousRating = ratings.find(
          (item) =>
            String(
              typeof item.user === "object"
                ? item.user?._id
                : item.user
            ) === String(currentUserId)
        );

        if (previousRating) {
          setSelectedRating(previousRating.value);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load recipe."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user?.id, user?._id]);

  const handleRating = async () => {
    if (!selectedRating) {
      setMessage("Please select a star rating first.");
      return;
    }

    try {
      setSubmittingRating(true);
      setMessage("");
      setError("");

      const response = await API.post(
        `/api/recipes/${id}/rating`,
        { rating: selectedRating }
      );

      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);

      setRecipe((previous) => {
        if (!previous) return previous;

        const ratings = [...(previous.ratings || [])];

        const existingIndex = ratings.findIndex((item) => {
          const ratingUserId =
            typeof item.user === "object"
              ? item.user?._id
              : item.user;

          return String(ratingUserId) === String(userId);
        });

        const updatedRating = {
          user: userId,
          value: selectedRating,
        };

        if (existingIndex >= 0) {
          ratings[existingIndex] = updatedRating;
        } else {
          ratings.push(updatedRating);
        }

        return { ...previous, ratings };
      });

      setMessage("Your rating was submitted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not submit your rating. Please log in and try again."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error && !recipe) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const existingRating = (recipe.ratings || []).find((item) => {
    const ratingUserId =
      typeof item.user === "object" ? item.user?._id : item.user;

    return String(ratingUserId) === String(userId);
  });

  return (
    <div className="recipe-details">
      <div className="recipe-details-header">
        <Link to="/recipes">← Back to Recipes</Link>

        {isOwner && (
          <Link
            to={`/edit-recipe/${recipe._id}`}
            className="edit-recipe-button"
          >
            ✏️ Edit Recipe
          </Link>
        )}
      </div>

      <h1>{recipe.title}</h1>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-details-image"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      <p>{recipe.description}</p>

      <p>
        <strong>Preparation time:</strong>{" "}
        {recipe.preparationTime} minutes
      </p>

      <p>
        <strong>Cooking time:</strong> {recipe.cookingTime} minutes
      </p>

      <p>
        <strong>Servings:</strong> {recipe.servings}
      </p>

      <p>
        <strong>Chef:</strong>{" "}
        {recipe.chef?.name || "Unknown chef"}
      </p>

      <section className="recipe-rating">
        <h2>Recipe Rating</h2>

        <p>
          <strong>{averageRating.toFixed(1)} / 5</strong>{" "}
          ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </p>

        {user ? (
          <>
            <p>Rate this recipe:</p>

            <div aria-label="Choose a rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setSelectedRating(star);
                    setMessage("");
                    setError("");
                  }}
                  aria-label={`Rate ${star} out of 5`}
                  aria-pressed={selectedRating === star}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "30px",
                    color:
                      star <= selectedRating ? "#f5a623" : "#aaa",
                    padding: "2px 5px",
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            {existingRating && (
              <p>Your previous rating: {existingRating.value} / 5</p>
            )}

            <button
              type="button"
              onClick={handleRating}
              disabled={submittingRating}
            >
              {submittingRating ? "Submitting..." : "Submit Rating"}
            </button>
          </>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to rate this recipe.
          </p>
        )}

        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </section>

      <section>
        <h2>Ingredients</h2>
        <ul>
          {(recipe.ingredients || []).map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Instructions</h2>
        <ol>
          {(recipe.instructions || []).map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default RecipeDetails;
