import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import CommitView from "./CommitView"; // Component to view commits
import "../styles/RecipeView.css";

function RecipeView() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCommits, setShowCommits] = useState(false); // Toggle commit view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowCommits(false); // Hide commits when a new recipe is selected
  };

  const handleEditClick = () => {
    navigate(`/editRecipe`, { state: { recipe: selectedRecipe } }); // Navigate to EditRecipe
  };

  const handleAddComponentClick = () => {
    navigate(`/recipeForm`, { state: { recipe: selectedRecipe } });
  };
  
  
  

  const toggleCommitsView = () => {
    setShowCommits(!showCommits); // Toggle commit view
  };

  return (
    <div className="recipe-view">
      {!selectedRecipe ? (
        <div className="recipe-list">
          <h2>Available Recipes</h2>
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-box"
                onClick={() => handleRecipeClick(recipe)}
              >
                <h3>{recipe.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="selected-recipe">
          <nav className="top-nav">
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={handleAddComponentClick}>Add Component</button>
            <button onClick={toggleCommitsView}>
              {showCommits ? "Hide Commits" : "View Commits"}
            </button>
          </nav>
          <div className="recipe-details">
            <h2>{selectedRecipe.name}</h2>
            <p>{selectedRecipe.description}</p>
            <h3>Components:</h3>
            <ul>
              {(Array.isArray(selectedRecipe.componentsData)
                ? selectedRecipe.componentsData
                : []
              ).map((component, index) => (
                <li key={index}>
                  <h4>{component.name}</h4>
                  <p><strong>Description:</strong> {component.description}</p>
                  {/* Additional fields */}
                </li>
              ))}
            </ul>
          </div>
          {showCommits && (
            <div className="commit-view">
              <h3>Commit History</h3>
              <CommitView recipeId={selectedRecipe.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeView;



