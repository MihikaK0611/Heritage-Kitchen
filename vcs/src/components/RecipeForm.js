import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";
import "../styles/RecipeForm.css";

function RecipeForm({ recipeId: propRecipeId, onComplete, onFinalSubmit }) {
  const location = useLocation();
  const [recipeId, setRecipeId] = useState(propRecipeId || ""); // Use prop or state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    servings: "",
    ingredients: "",
    type: "",
    nutrition: "",
    directions: "",
    notAllowedFor: "",
    time: "",
    tips: "",
    otherMedia: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  // Retrieve recipeId from the recipe object in state if provided
  useEffect(() => {
    if (!propRecipeId && location.state?.recipe) {
      const derivedRecipeId = getRecipeIdFromRecipe(location.state.recipe);
      setRecipeId(derivedRecipeId);
    }
  }, [propRecipeId, location.state]);

  // Function to derive recipeId from the recipe object
  const getRecipeIdFromRecipe = (recipe) => {
    // Logic to extract recipeId from the recipe object
    // Replace this logic with actual key extraction from your recipe object
    return recipe.id || ""; // Assuming the recipe object has an `id` field
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!recipeId) {
      alert("No recipeId found. Please try again.");
      return;
    }
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, {
        componentsData: arrayUnion({ ...formData }),
      });
      alert("Recipe component added successfully!");
      setIsSaved(true);
      if (onComplete) onComplete(); // Notify the parent if function is provided
    } catch (error) {
      console.error("Error saving recipe component: ", error);
      alert("Failed to save the recipe component. Please try again.");
    }
  };

  const handleFinalSubmit = () => {
    if (!isSaved) {
      alert("Please save the current component before submitting.");
      return;
    }
    alert("All components submitted! Redirecting to the Recipe Table.");
    if (onFinalSubmit) onFinalSubmit(); // Redirect to RecipeTable if function is provided
  };

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSave}>
        <h2>Recipe Details</h2>
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <label>Servings:</label>
        <input
          name="servings"
          type="number"
          value={formData.servings}
          onChange={handleChange}
          required
        />
        <label>Ingredients:</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
        />
        <label>Type:</label>
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
        />
        <label>Nutrition:</label>
        <input
          name="nutrition"
          value={formData.nutrition}
          onChange={handleChange}
        />
        <label>Directions:</label>
        <textarea
          name="directions"
          value={formData.directions}
          onChange={handleChange}
        />
        <label>Not Allowed For:</label>
        <input
          name="notAllowedFor"
          value={formData.notAllowedFor}
          onChange={handleChange}
        />
        <label>Time (mins):</label>
        <input
          name="time"
          type="number"
          value={formData.time}
          onChange={handleChange}
        />
        <label>Tips:</label>
        <textarea
          name="tips"
          value={formData.tips}
          onChange={handleChange}
        />
        <label>Other Media:</label>
        <input
          name="otherMedia"
          value={formData.otherMedia}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit">Save Component</button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="final-submit-button"
          >
            Final Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
