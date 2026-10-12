
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ChefDashboard() {
  const { user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    preparationTime: "",
    cookingTime: "",
    servings: "",
    image: "",
  });

  async function fetchRecipes() {
    try {
      const response = await API.get("/api/recipes");

      const allRecipes = Array.isArray(response.data)
        ? response.data
        : response.data.recipes || [];

      const chefId = user?._id || user?.id;

      const myRecipes = chefId
        ? allRecipes.filter(
            (recipe) =>
              String(recipe.chef?._id || recipe.chef) === String(chefId)
          )
        : [];

      setRecipes(myRecipes);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to load recipes."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        instructions: formData.instructions
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        preparationTime: Number(formData.preparationTime),
        cookingTime: Number(formData.cookingTime),
        servings: Number(formData.servings),
      };

      await API.post("/api/recipes", recipeData);

      setMessage("Recipe created successfully!");

      setFormData({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        preparationTime: "",
        cookingTime: "",
        servings: "",
        image: "",
      });

      setShowForm(false);
      setLoading(true);
      await fetchRecipes();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not create recipe. Please check your login and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="chef-dashboard">
      <section className="dashboard-heading">
        <p className="eyebrow">RECIPEHUB CHEF STUDIO</p>
        <h1>Chef Dashboard 👨‍🍳</h1>
        <p>Welcome, {user?.name || "Chef"}!</p>
      </section>

      <section className="dashboard-summary">
        <h2>Your Recipes</h2>
        <p className="recipe-count">{recipes.length}</p>
        <p>Recipes created by you</p>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setMessage("");
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "+ Add New Recipe"}
        </button>
      </section>

      {message && (
        <p className="dashboard-message" role="status">
          {message}
        </p>
      )}

      {showForm && (
        <section className="recipe-form-section">
          <h2>Create a New Recipe</h2>

          <form onSubmit={handleSubmit} className="recipe-form">
            <label htmlFor="title">Recipe Name</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Paneer Tikka"
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your recipe"
              required
            />

            <label htmlFor="ingredients">
              Ingredients (enter one per line)
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder={"Paneer\nCurd\nSpices"}
              required
            />

            <label htmlFor="instructions">
              Cooking Instructions (one step per line)
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder={"Cut the paneer\nPrepare the marinade\nCook until ready"}
              required
            />

            <div className="form-number-grid">
              <div>
                <label htmlFor="preparationTime">
                  Preparation (minutes)
                </label>
                <input
                  id="preparationTime"
                  name="preparationTime"
                  type="number"
                  min="1"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="cookingTime">Cooking (minutes)</label>
                <input
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  min="1"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="servings">Servings</label>
                <input
                  id="servings"
                  name="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label htmlFor="image">Recipe Image URL (optional)</label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/recipe.jpg"
            />

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving Recipe..." : "Save Recipe"}
            </button>
          </form>
        </section>
      )}

      {loading && <p>Loading your recipes...</p>}

      {!loading && recipes.length === 0 && !message && (
        <p>You haven't added any recipes yet.</p>
      )}

      {!loading && recipes.length > 0 && (
        <section>
          <h2>Manage Your Recipes</h2>

          <div className="recipes-list">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe._id}>
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
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ChefDashboard;
