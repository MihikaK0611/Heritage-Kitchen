import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the import path based on your file structure
import "../styles/RecipeTable.css";

function RecipeTable({ recipeId, numComponents, savedComponents, setSavedComponents, onFinalSubmit }) {
  const [components, setComponents] = useState([]); // Manage components in local state
  const navigate = useNavigate();

  // Navigate to RecipeForm page
  const handleAddComponent = () => {
    navigate('/recipeForm');
  };

  // Save a new component to Firebase and update local state
  const handleSaveComponent = async (componentData) => {
    try {
      const docRef = await addDoc(collection(db, "components"), componentData);
      setComponents((prevComponents) => [
        ...prevComponents,
        { ...componentData, id: docRef.id },
      ]);

      // Add saved index to the savedComponents array
      setSavedComponents((prevSavedComponents) => [
        ...prevSavedComponents,
        components.length, // Using components.length for the new component's index
      ]);
      alert("Component added successfully!");
    } catch (error) {
      console.error("Error adding component: ", error);
      alert("Failed to add component. Please try again.");
    }
  };

  return (
    <div className="recipeTable">
      <h2>Recipe Components</h2>
      <div className="components-list">
        {components.map((component, index) => (
          <div key={component.id} className="component-item">
            <span>{component.name}</span>
            {savedComponents.includes(index) && (
              <span className="saved-status">Saved</span>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleAddComponent}>Add Component</button>
      <button className="final-submit-button" onClick={onFinalSubmit}>
        Final Submit
      </button>
    </div>
  );
}

export default RecipeTable;






