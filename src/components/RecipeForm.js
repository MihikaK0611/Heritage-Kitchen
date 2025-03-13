import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, addDoc, collection, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import "../styles/RecipeForm.css";
import { getAuth } from "firebase/auth";

function RecipeForm({ recipeId, onComplete, onFinalSubmit }) {
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
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving recipe component: ", error);
      alert("Failed to save the recipe component. Please try again.");
    }
  };

  const handleFinalSubmit = async () => {
    if (!isSaved) {
      alert("Please save the current component before submitting.");
      return;
    }

    try {
      if (!recipeId) {
        throw new Error("Recipe ID is missing.");
      }

      const recipeRef = doc(db, "recipes", recipeId);
      const recipeSnapshot = await getDoc(recipeRef);

      if (!recipeSnapshot.exists()) {
        throw new Error("Recipe not found in the database.");
      }

      const recipeData = recipeSnapshot.data();
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      

      alert("Recipe created successfully! Redirecting...");
      if (onFinalSubmit) onFinalSubmit();
    } catch (error) {
      console.error("Error creating commit: ", error);
      alert("Failed to create commit. Please try again.");
    }
  };

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSave}>
        <h2>Recipe Details</h2>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
        <label>Servings:</label>
        <input name="servings" type="number" value={formData.servings} onChange={handleChange} required />
        <label>Ingredients:</label>
        <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} required />
        <label>Type:</label>
        <input name="type" value={formData.type} onChange={handleChange} />
        <label>Nutrition:</label>
        <input name="nutrition" value={formData.nutrition} onChange={handleChange} />
        <label>Directions:</label>
        <textarea name="directions" value={formData.directions} onChange={handleChange} />
        <label>Not Allowed For:</label>
        <input name="notAllowedFor" value={formData.notAllowedFor} onChange={handleChange} />
        <label>Time (mins):</label>
        <input name="time" type="number" value={formData.time} onChange={handleChange} />
        <label>Tips:</label>
        <textarea name="tips" value={formData.tips} onChange={handleChange} />
        <label>Other Media:</label>
        <input name="otherMedia" value={formData.otherMedia} onChange={handleChange} />
        <div className="form-buttons">
          <button type="submit">Save Component</button>
          <button type="button" onClick={handleFinalSubmit} className="final-submit-button">
            Final Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;


