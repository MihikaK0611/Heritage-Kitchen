import React, { useState } from "react";
import { doc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";

const EditRecipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe; // Recipe passed from RecipeView
  const [editedFields, setEditedFields] = useState({});
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedFields({ ...editedFields, [name]: value });
  };

  const handleComponentChange = (e) => {
    const { name, value } = e.target;
    const updatedComponents = [...(editedFields.componentsData || recipe.componentsData)];
    updatedComponents[currentComponentIndex] = {
      ...updatedComponents[currentComponentIndex],
      [name]: value,
    };
    setEditedFields({ ...editedFields, componentsData: updatedComponents });
  };

  const saveChanges = async () => {
    try {
      const recipeRef = doc(db, "recipes", recipe.id);
      const newVersion =  recipe.version + 1;
      // Merge the recipe with edited fields
      const updatedRecipe = { ...recipe, ...editedFields, version: newVersion };
      
      
      console.log("Updated recipe:", updatedRecipe);
  
      // Update the `recipes` collection
      await updateDoc(recipeRef, updatedRecipe);
  
      // Fetch previous commits to determine if this is the first edit
      const commitRef = collection(db, "commits");
  
      // Ensure version starts from 1 if no previous edits exist
      
  
      // Add a commit entry to the `commits` collection
      const commitData = {
        msg: `Edited recipe: ${recipe.name}`,
        initial: recipe.version ? recipe : null, // Store initial only if it has been edited before
        final: updatedRecipe,
        editedBy: "User123",
        type: "edited",
        version: newVersion,
        timestamp: serverTimestamp(),
      };
  
      console.log("Adding commit:", commitData);
  
      await addDoc(commitRef, commitData);
  
      console.log("Commit successfully added to Firestore.");
  
      alert("Recipe updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving changes to Firestore:", error);
      alert("Failed to update the recipe. Please try again.");
    }
  };
  

  const handleNextComponent = () => {
    if (currentComponentIndex < recipe.componentsData.length - 1) {
      setCurrentComponentIndex(currentComponentIndex + 1);
    } else {
      alert("You have reached the last component.");
    }
  };

  const handlePreviousComponent = () => {
    if (currentComponentIndex > 0) {
      setCurrentComponentIndex(currentComponentIndex - 1);
    }
  };

  return (
    <div className="edit-recipe">
      <div className="edit-recipe-container">
        <div className="recipe-details">
          <h2>Recipe Details</h2>
          <p><strong>Name:</strong> {recipe.name}</p>
          <p><strong>Description:</strong> {recipe.description}</p>
          <h3>Components:</h3>
          <ul>
            {recipe.componentsData.map((component, index) => (
              <li key={index}>
                <p><strong>Name:</strong> {component.name}</p>
                <p><strong>Description:</strong> {component.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="edit-form">
          <h2>Edit Recipe</h2>
          <div className="form-group">
            <label htmlFor="name">Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={recipe.name}
              onChange={handleFieldChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={recipe.description}
              onChange={handleFieldChange}
            />
          </div>

          <div className="form-group">
            <h3>Edit Component {currentComponentIndex + 1}</h3>
            {recipe.componentsData[currentComponentIndex] && (
              <>
                <label htmlFor="componentName">Name</label>
                <input
                  type="text"
                  id="componentName"
                  name="name"
                  defaultValue={recipe.componentsData[currentComponentIndex].name}
                  onChange={handleComponentChange}
                />

                <label htmlFor="componentDescription">Description</label>
                <textarea
                  id="componentDescription"
                  name="description"
                  defaultValue={recipe.componentsData[currentComponentIndex].description}
                  onChange={handleComponentChange}
                />
              </>
            )}
            <div className="navigation-buttons">
              <button type="button" onClick={handlePreviousComponent}>
                Previous Component
              </button>
              <button type="button" onClick={handleNextComponent}>
                Next Component
              </button>
            </div>
          </div>

          <button type="button" onClick={saveChanges}>Save Changes</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
