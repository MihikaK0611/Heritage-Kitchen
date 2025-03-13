import React, { useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LandingPage from "./components/LandingPage";
import Navigation from "./components/Navigation";
import InitialForm from "./components/InitialForm";
import RecipeTable from "./components/RecipeTable";
import RecipeForm from "./components/RecipeForm";
import RecipeView from "./components/RecipeView";
import EditRecipe from "./components/EditRecipe"; // Import EditRecipe component
import CommitView from "./components/CommitView";
import AddRecipe from "./components/AddRecipe"; // Import CommitView component
import DeleteRecipe from "./components/DeleteRecipe";
import Search from "./components/Search";
import RecipeDetails from "./components/RecipeDetails";
import Feedback from "./components/Feedback";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [numComponents, setNumComponents] = useState(0);
  const [savedComponents, setSavedComponents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
    navigate("/navigation");
  };

  const handleSignup = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
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
      <Route path="/" element={<LandingPage />} />
      <Route path = "/feedback" element={<Feedback/>}/>

      {/* Login & Signup Routes */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
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
    isLoggedIn ? (
      <RecipeView currentUser={currentUser} /> // Pass currentUser as props
    ) : (
      <Navigate to="/" />
    )
  }
/>

<Route path="/search" element={isLoggedIn ? <Search /> : <Navigate to="/" />} />


<Route
  path="/recipe/:id"
  element={isLoggedIn ? <RecipeDetails currentUser={currentUser} /> : <Navigate to="/" />}
/>


<Route
  path="/deleteRecipe"
  element={isLoggedIn ? <DeleteRecipe /> : <Navigate to="/" />}
/>

      <Route
        path="/editRecipe"
        element={
          isLoggedIn ? <EditRecipe /> : <Navigate to="/" />
        }
      />

      <Route
        path="/addRecipe"
        element={
          isLoggedIn ? <AddRecipe currentUser={currentUser} /> : <Navigate to="/" />
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












