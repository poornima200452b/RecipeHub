
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/" className="brand">
        <h2>RecipeHub 🍲</h2>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/trending">Trending</Link>
        <Link to="/top-rated">Top Rated ⭐</Link>
        <Link to="/ingredient-finder">Ingredient Finder 🥕</Link>

        {user ? (
          <>
            {user.role === "chef" && (
              <Link to="/chef-dashboard">Chef Dashboard</Link>
            )}

            <span>Hi, {user.name || "Chef"}!</span>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
