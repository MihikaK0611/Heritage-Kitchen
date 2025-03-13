import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, getDoc, addDoc, collection } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
import "../styles/RecipeForm.css";

function AddRecipe({ currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

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
    if (!recipe || !recipe.id) {
      alert("No recipe found. Please try again.");
      return;
    }
    try {
      const recipeRef = doc(db, "recipes", recipe.id);
      const recipeSnapshot = await getDoc(recipeRef);

      if (!recipeSnapshot.exists()) {
        throw new Error("Recipe not found in the database.");
      }

      const existingRecipe = recipeSnapshot.data();
      const updatedRecipe = {
        ...existingRecipe,
        componentsData: arrayUnion({ ...formData }),
      };

      await updateDoc(recipeRef, updatedRecipe);
      setIsSaved(true);
      alert("Recipe component added successfully!");
    } catch (error) {
      console.error("Error saving recipe component: ", error);
      alert("Failed to save the recipe component. Please try again.");
    }
  };

  /*const handleFinalSubmit = async () => {
    if (!isSaved) {
      alert("Please save the current component before submitting.");
      return;
    }
  
    try {
      if (!recipe || !recipe.id) {
        throw new Error("Recipe ID is missing.");
      }
  
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }
  
      const recipeRef = doc(db, "recipes", recipe.id);
      const recipeSnapshot = await getDoc(recipeRef);
  
      if (!recipeSnapshot.exists()) {
        throw new Error("Recipe not found in the database.");
      }
  
      const oldRecipeData = recipeSnapshot.data();
      const newVersion = oldRecipeData.version + 1;
  
      await updateDoc(recipeRef, { version: newVersion });
  
      const updatedSnapshot = await getDoc(recipeRef);
      const updatedRecipeData = updatedSnapshot.data();
  
      // Rename recipeId to id
      const formattedInitial = { id: recipe.id, ...oldRecipeData };
      const formattedFinal = { id: recipe.id, ...updatedRecipeData };
  
      await addDoc(collection(db, "commits"), {
        msg: "Added Component",
        type: "Component addition",
        version: newVersion,
        timestamp: new Date(),
        initial: formattedInitial, 
        final: formattedFinal,     
      });
  
      alert("Recipe updated successfully!");
      navigate("/recipeView");
    } catch (error) {
      console.error("Error creating commit: ", error);
      alert(error.message);
    }
  };*/
  const handleFinalSubmit = async () => {
    if (!isSaved) {
      alert("Please save the current component before submitting.");
      return;
    }
  
    try {
      if (!recipe || !recipe.id) {
        throw new Error("Recipe ID is missing.");
      }
  
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }
  
      const recipeRef = doc(db, "recipes", recipe.id);
  
      // Fetch the current recipe **before** updating
      const recipeSnapshot = await getDoc(recipeRef);
  
      if (!recipeSnapshot.exists()) {
        throw new Error("Recipe not found in the database.");
      }
  
      // Store the previous state before update
      const oldRecipeData = JSON.parse(JSON.stringify(recipeSnapshot.data())); // Deep clone
      const newVersion = oldRecipeData.version + 1;
  
      console.log("📌 Captured Initial Data:", oldRecipeData);
  
      // Update the version field
      await updateDoc(recipeRef, { version: newVersion });
  
      // Fetch the updated data
      const updatedSnapshot = await getDoc(recipeRef);
      const updatedRecipeData = updatedSnapshot.data();
  
      console.log("✅ Updated Data:", updatedRecipeData);
  
      // Ensure the order of componentsData is preserved
      const formattedInitial = { id: recipe.id, version: oldRecipeData.version, ...oldRecipeData };
      const formattedFinal = { id: recipe.id, version: newVersion, ...updatedRecipeData };
  
      console.log("📝 Commit Initial (Before Update):", formattedInitial);
      console.log("📝 Commit Final (After Update):", formattedFinal);
  
      await addDoc(collection(db, "commits"), {
        msg: "Added Component",
        type: "Component addition",
        version: newVersion,
        timestamp: new Date(),
        initial: formattedInitial,
        final: formattedFinal,
      });
  
      alert("Recipe updated successfully!");
      navigate("/recipeView");
    } catch (error) {
      console.error("❌ Error creating commit: ", error);
      alert(error.message);
    }
  };
  

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSave}>
        <h2>Add Recipe Component</h2>
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

export default AddRecipe;

