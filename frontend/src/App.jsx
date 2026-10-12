
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ChefDashboard from "./pages/ChefDashboard";
import Home from "./pages/Home";
import IngredientFinder from "./pages/IngredientFinder";
import Login from "./pages/Login";
import RecipeDetails from "./pages/RecipeDetails";
import Recipes from "./pages/Recipes";
import Register from "./pages/Register";
import TopRatedRecipes from "./pages/TopRatedRecipes";
import TrendingRecipes from "./pages/TrendingRecipes";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chef-dashboard"
          element={<ChefDashboard />}
        />
        <Route path="/trending" element={<TrendingRecipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/top-rated" element={<TopRatedRecipes />} />
        <Route path="/ingredient-finder" element={<IngredientFinder />}
/>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
