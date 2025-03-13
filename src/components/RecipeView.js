/*import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";
import CommitView from "./CommitView"; 
import "../styles/RecipeView.css";

function RecipeView({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCommits, setShowCommits] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Current User in RecipeView:", currentUser);
    
    const fetchUserRecipes = async () => {
      if (!currentUser || !currentUser.email) {
        console.error("No user is logged in or email is missing.");
        return; 
      }
    
      try {
        const userRecipeQuery = query(
          collection(db, "user_recipes"),
          where("userEmail", "==", currentUser.email)
        );
        const userRecipeSnapshot = await getDocs(userRecipeQuery);
    
        if (userRecipeSnapshot.empty) {
          console.warn("No recipes found in user_recipes for user:", currentUser.email);
        }
    
        const recipeIds = userRecipeSnapshot.docs.map(doc => doc.data().recipeId);
        console.log("Fetched recipe IDs:", recipeIds);
    
        const recipesData = await Promise.all(
          recipeIds.map(async (recipeId) => {
            const recipeQuery = query(collection(db, "recipes"), where("recipeId", "==", recipeId));
            const recipeSnapshot = await getDocs(recipeQuery);
    
            if (recipeSnapshot.empty) {
              console.warn(`No recipe found for ID: ${recipeId}`);
            }
    
            return recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          })
        );
    
        const filteredRecipes = recipesData.flat();
        console.log("Fetched recipes:", filteredRecipes);
        setRecipes(filteredRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };
    

    fetchUserRecipes();
  }, [currentUser]);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowCommits(false); 
  };

  const handleEditClick = () => {
    navigate(`/editRecipe`, { state: { recipe: selectedRecipe } }); 
  };

  const handleAddComponentClick = () => {
    navigate(`/addRecipe`, { state: { recipe: selectedRecipe } });
  };

  const toggleCommitsView = () => {
    setShowCommits(!showCommits); 
  };

  return (
    <div className="recipe-view">
      {!selectedRecipe ? (
        <div className="recipe-list">
          <h2>Available Recipes</h2>
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-box"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <h3>{recipe.name}</h3>
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
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

export default RecipeView;*/

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";
import CommitView from "./CommitView"; 
import "../styles/RecipeView.css";
import undoCommit from "./Undo";

function RecipeView({ currentUser }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCommits, setShowCommits] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Current User in RecipeView:", currentUser);
    
    const fetchUserRecipes = async () => {
      if (!currentUser || !currentUser.email) {
        console.error("No user is logged in or email is missing.");
        return; 
      }
    
      try {
        const userRecipeQuery = query(
          collection(db, "user_recipes"),
          where("userEmail", "==", currentUser.email)
        );
        const userRecipeSnapshot = await getDocs(userRecipeQuery);
    
        if (userRecipeSnapshot.empty) {
          console.warn("No recipes found in user_recipes for user:", currentUser.email);
        }
    
        const recipeIds = userRecipeSnapshot.docs.map(doc => doc.data().recipeId);
        console.log("Fetched recipe IDs:", recipeIds);
    
        const recipesData = await Promise.all(
          recipeIds.map(async (recipeId) => {
            const recipeQuery = query(collection(db, "recipes"), where("recipeId", "==", recipeId));
            const recipeSnapshot = await getDocs(recipeQuery);
    
            if (recipeSnapshot.empty) {
              console.warn(`No recipe found for ID: ${recipeId}`);
            }
    
            return recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          })
        );
    
        const filteredRecipes = recipesData.flat();
        console.log("Fetched recipes:", filteredRecipes);
        setRecipes(filteredRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };
    
    fetchUserRecipes();
  }, [currentUser]);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowCommits(false); 
  };

  const handleEditClick = () => {
    navigate(`/editRecipe`, { state: { recipe: selectedRecipe } }); 
  };

  const handleAddComponentClick = () => {
    navigate(`/addRecipe`, { state: { recipe: selectedRecipe } });
  };

  const toggleCommitsView = () => {
    setShowCommits(!showCommits); 
  };

  const handleDeleteClick = () => {
    navigate(`/deleteRecipe`, { state: { recipe: selectedRecipe } });
  };

  const handleUndoClick = async () => {
    if (!selectedRecipe) return;
    if (!currentUser) {
      alert("You must be logged in to undo.");
      return;
    }
  
    try {
      const response = await undoCommit(selectedRecipe.id, currentUser);
      alert(response.message);
    } catch (error) {
      console.error("Undo failed:", error);
      alert("Undo failed: " + error.message);
    }
  };
  

  return (
    <div className="recipe-view">
      {!selectedRecipe ? (
        <div className="recipe-list">
          <h2>Available Recipes</h2>
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-box"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <h3>{recipe.name}</h3>
                </div>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
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
            <button onClick={handleUndoClick}>Undo</button>
            <button onClick={handleDeleteClick}>Delete</button> 
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


