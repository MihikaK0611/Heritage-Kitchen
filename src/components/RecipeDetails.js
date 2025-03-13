import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique IDs
import "../styles/RecipeDetails.css";

function RecipeDetails({ currentUser }) {
  console.log("Current User in RecipeDetails:", currentUser); // Debugging log

  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  const handleFork = async () => {
    if (!currentUser || !currentUser.email) {
      alert("You must be logged in to fork a recipe.");
      return;
    }

    try {
      const newRecipeId = uuidv4(); // Generate unique recipe ID

      const forkedRecipe = {
        ...recipe,
        recipeId: newRecipeId,
        userEmail: currentUser.email,
        version: 1,
        collaborators: [currentUser.email],
        forked: true,
      };

      await addDoc(collection(db, "recipes"), forkedRecipe);
      await addDoc(collection(db, "user_recipes"), {
        userEmail: currentUser.email,
        recipeId: newRecipeId,
      });

      alert("Recipe forked successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Error forking recipe:", error);
      alert("Failed to fork recipe.");
    }
  };

  return (
    <div className="recipe-details-container">
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={handleFork}>Fork</button>
      <h2>{recipe.name} {recipe.forked ? "(Forked)" : ""}</h2>
      <p>{recipe.description}</p>
      <h3>Components:</h3>
      <ul>
        {recipe.componentsData.map((component, index) => (
          <li key={index}>
            <h4>{component.name}</h4>
            <p><strong>Description:</strong> {component.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default RecipeDetails;
