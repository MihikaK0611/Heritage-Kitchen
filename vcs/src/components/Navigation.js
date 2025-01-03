import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navigation.css";

function Navigation({ onAddRecipe, onViewRecipes }) {
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    onAddRecipe();
  };

  const handleViewRecipes = () => {
    onViewRecipes();
  };

  return (
    <div className="navigation-container">
      <h2>Recipe Management</h2>
      <button onClick={handleAddRecipe}>Add Recipe</button>
      <button onClick={handleViewRecipes}>View Recipes</button>
    </div>
  );
}

export default Navigation;

