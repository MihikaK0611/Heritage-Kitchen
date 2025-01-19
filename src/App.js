import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import AddRecipe from "./components/AddRecipe";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import Feedback from "./components/Feedback";
import CreateGroup from "./components/CreateGroup";
import GroupProfile from "./components/GroupProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addrecipe" element={<AddRecipe />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/creategroup" element={<CreateGroup />} />
        <Route path="/groupprofile" element={<GroupProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
