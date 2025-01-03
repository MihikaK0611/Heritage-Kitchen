import React, { useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import InitialForm from "./components/InitialForm";
import RecipeTable from "./components/RecipeTable";
import RecipeForm from "./components/RecipeForm";
import RecipeView from "./components/RecipeView";
import EditRecipe from "./components/EditRecipe"; // Import EditRecipe component
import CommitView from "./components/CommitView"; // Import CommitView component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [numComponents, setNumComponents] = useState(0);
  const [savedComponents, setSavedComponents] = useState([]);

  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/navigation");
  };

  const handleAddRecipe = () => {
    navigate("/initialForm");
  };

  const handleViewRecipes = () => {
    navigate("/recipeView");
  };

  const handleCompleteInitialForm = (id, numComp) => {
    setRecipeId(id);
    setNumComponents(numComp);
    navigate("/recipeTable");
  };

  const handleAddComponent = () => {
    navigate("/recipeForm");
  };

  const handleFinalSubmitTable = () => {
    navigate("/navigation");
  };

  const handleFinalSubmitForm = () => {
    navigate("/recipeTable");
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/navigation"
        element={
          isLoggedIn ? (
            <Navigation
              onAddRecipe={handleAddRecipe}
              onViewRecipes={handleViewRecipes}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/initialForm"
        element={
          isLoggedIn ? (
            <InitialForm onComplete={handleCompleteInitialForm} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      
      <Route
        path="/recipeTable"
        element={
          isLoggedIn ? (
            <RecipeTable
              recipeId={recipeId}
              numComponents={numComponents}
              savedComponents={savedComponents}
              onAddComponent={handleAddComponent}
              onFinalSubmit={handleFinalSubmitTable}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/recipeForm"
        element={
          isLoggedIn ? (
            <RecipeForm recipeId={recipeId} onComplete={handleFinalSubmitForm} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/recipeView"
        element={
          isLoggedIn ? <RecipeView /> : <Navigate to="/" />
        }
      />
      <Route
        path="/editRecipe"
        element={
          isLoggedIn ? <EditRecipe /> : <Navigate to="/" />
        }
      />
      <Route
        path="/commitView"
        element={
          isLoggedIn ? <CommitView /> : <Navigate to="/" />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;












