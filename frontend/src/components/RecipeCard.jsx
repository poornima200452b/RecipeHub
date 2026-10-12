
import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  if (!recipe) return null;

  return (
    <article className="recipe-card">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-image"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      <p>Preparation: {recipe.preparationTime} minutes</p>
      <p>Cooking: {recipe.cookingTime} minutes</p>
      <p>Servings: {recipe.servings}</p>

      <Link
        to={`/recipes/${recipe._id}`}
        className="primary-button recipe-view-link"
      >
        View Recipe
      </Link>
    </article>
  );
}

export default RecipeCard;
