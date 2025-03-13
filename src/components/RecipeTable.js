import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; 
import "../styles/RecipeTable.css";

function RecipeTable({ recipeId, numComponents, savedComponents, setSavedComponents, onFinalSubmit }) {
  const [components, setComponents] = useState([]); 
  const navigate = useNavigate();

  
  const handleAddComponent = () => {
    navigate('/recipeForm');
  };

  
  const handleSaveComponent = async (componentData) => {
    try {
      const docRef = await addDoc(collection(db, "components"), componentData);
      setComponents((prevComponents) => [
        ...prevComponents,
        { ...componentData, id: docRef.id },
      ]);

      setSavedComponents((prevSavedComponents) => [
        ...prevSavedComponents,
        components.length, 
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
      <div className="button-container">
        <button onClick={handleAddComponent}>Add Component</button>
        <button className="final-submit-button" onClick={onFinalSubmit}>
          Final Submit
        </button>
      </div>
    </div>
  );
}

export default RecipeTable;
