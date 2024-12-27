import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { Menu, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./Profile.css";

const HomePage = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [originalRecipes] = useState([
    { name: "Pasta Primavera", description: "A classic Italian dish with fresh vegetables and pasta.", occasion: "Dinner", diet: "Vegetarian", ingredients: ["Pasta", "Tomato"] },
    { name: "Chicken Curry", description: "A rich and flavorful curry made with tender chicken pieces.", occasion: "Lunch", diet: "Non-Vegetarian", ingredients: ["Chicken", "Curry Powder"] },
    { name: "Chocolate Cake", description: "A moist and delicious dessert perfect for any occasion.", occasion: "Dessert", diet: "Vegetarian", ingredients: ["Chocolate", "Flour"] },
  ]);
  const [recipes, setRecipes] = useState([...originalRecipes]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("recipe");
  const [sortOrder, setSortOrder] = useState("asc");

  const [occasionFilter, setOccasionFilter] = useState("");
  const [dietFilter, setDietFilter] = useState("");
  const [ingredientFilter, setIngredientFilter] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleAddRecipe = () => {
    navigate("/addrecipe");
  };

  const handleSearch = () => {
    let filteredRecipes = [...originalRecipes];

    if (searchCategory === "recipe") {
      if (searchQuery) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (occasionFilter) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.occasion === occasionFilter
        );
      }

      if (dietFilter) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.diet === dietFilter
        );
      }

      if (ingredientFilter) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.ingredients.some((ing) =>
            ing.toLowerCase().includes(ingredientFilter.toLowerCase())
          )
        );
      }
    }

    if (sortOrder === "asc") {
      filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filteredRecipes.sort((a, b) => b.name.localeCompare(a.name));
    }

    setRecipes(filteredRecipes);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      {dashboardOpen && (
        <div className="sidebar">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setDashboardOpen(!dashboardOpen)}
            className="sidebar-logo"
          >
            🍳
          </div>
          <ul className="sidebar-menu">
            <li>Home</li>
            <li onClick={handleAddRecipe}>Add Recipe</li>
            <li>Create Group</li>
            <li onClick={handleProfile}>Profile</li>
            <li>Settings</li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: 20 }}>
        {/* Search & Filter Section */}
        <div className="search-filter-container">
          <div className="search-filter-row">
            <IconButton
              onClick={() => setDashboardOpen(!dashboardOpen)}
              style={{ marginRight: "10px" }}
            >
              <Menu sx={{ fontSize: "2rem" }} />
            </IconButton>

            <input
              className="search-input"
              type="text"
              placeholder={`Search for ${searchCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="search-category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="recipe">Recipe</option>
              <option value="username">Username</option>
              <option value="groupname">Group Name</option>
            </select>

            <select
              className="sort-category"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            <button className="search-button" onClick={handleSearch}>
              🔍
            </button>

            <IconButton onClick={handleProfile} style={{ marginLeft: "auto" }}>
              <AccountCircle sx={{ fontSize: "2rem" }} />
            </IconButton>
          </div>

          {/* Additional Filters for Recipes */}
          {searchCategory === "recipe" && (
            <div className="additional-filters">
              <select
                value={occasionFilter}
                onChange={(e) => setOccasionFilter(e.target.value)}
              >
                <option value="">Occasion</option>
                <option value="Dinner">Dinner</option>
                <option value="Lunch">Lunch</option>
                <option value="Dessert">Dessert</option>
              </select>

              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
              >
                <option value="">Dietary Preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>

              <input
                type="text"
                placeholder="Search by ingredient..."
                value={ingredientFilter}
                onChange={(e) => setIngredientFilter(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Recipe List */}
        <h2>Recipes</h2>
        <List>
          {recipes.map((recipe, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <div>
                <ListItemText
                  primary={
                    <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
                      {recipe.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}
                    >
                      {recipe.description}
                    </Typography>
                  }
                />
              </div>

              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                  }}
                >
                  🖼️
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default HomePage;
