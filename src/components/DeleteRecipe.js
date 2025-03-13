import React, { useState } from "react";
import { doc, deleteDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";

function DeleteRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || null;
  const [deleting, setDeleting] = useState(false);

  if (!recipe) {
    console.error("Error: No recipe selected.");
    return null; // Don't render anything, just log an error
  }

  async function handleDeleteComponent(component) {
    if (!component) {
      console.warn("Warning: No component provided for deletion.");
      return;
    }

    try {
      setDeleting(true);

      // Log deletion in "deletions" collection
      await addDoc(collection(db, "deletions"), {
        type: "component",
        recipeId: recipe.id,
        componentName: component.name,
        timestamp: new Date(),
      });

      // Remove component from Firestore without deleting the whole recipe
      const updatedComponents = recipe.componentsData.filter(c => c.name !== component.name);
      await updateDoc(doc(db, "recipes", recipe.id), { componentsData: updatedComponents });

      alert(`Component "${component.name}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting component:", error);
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteRecipe() {
    try {
      setDeleting(true);

      // Log deletion
      await addDoc(collection(db, "deletions"), {
        type: "recipe",
        recipeId: recipe.id,
        recipeName: recipe.name,
        timestamp: new Date(),
      });

      // Delete the recipe document from Firestore
      await deleteDoc(doc(db, "recipes", recipe.id));

      alert("Recipe deleted successfully.");
      navigate("/navigation"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h2>Delete Recipe</h2>
      <p>Recipe Name: {recipe.name}</p>
      <p>{recipe.description}</p>

      <h3>Components:</h3>
      <ul>
        {recipe.componentsData.map((component, index) => (
          <li key={index}>
            {component.name} - {component.description}
            <button
              disabled={deleting}
              onClick={() => handleDeleteComponent(component)}
            >
              Delete Component
            </button>
          </li>
        ))}
      </ul>

      <button disabled={deleting} onClick={handleDeleteRecipe}>
        Delete Entire Recipe
      </button>

      <button onClick={() => navigate("/navigation")}>Cancel</button>
    </div>
  );
}

export default DeleteRecipe;
