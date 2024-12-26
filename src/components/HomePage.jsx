import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from "@mui/material";
import { Menu, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./Profile.css";

const HomePage = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);

  // Store original recipes and filtered recipes separately
  const [originalRecipes] = useState([
    { name: "Pasta Primavera", description: "A classic Italian dish with fresh vegetables and pasta." },
    { name: "Chicken Curry", description: "A rich and flavorful curry made with tender chicken pieces." },
    { name: "Chocolate Cake", description: "A moist and delicious dessert perfect for any occasion." },
  ]);
  const [recipes, setRecipes] = useState([...originalRecipes]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("recipe");
  const [sortOrder, setSortOrder] = useState("asc");

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
    let filteredRecipes = [...originalRecipes]; // Always start with the original list

    // Filter based on search query and category
    if (searchCategory === "recipe") {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort the recipes
    if (sortOrder === "asc") {
      filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filteredRecipes.sort((a, b) => b.name.localeCompare(a.name));
    }

    setRecipes(filteredRecipes); // Update the filtered recipes
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    handleSearch(); // Re-apply the search and sort
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
            {/* Dashboard Icon */}
            <IconButton
              onClick={() => setDashboardOpen(!dashboardOpen)}
              style={{ marginRight: "10px" }}
            >
              <Menu sx={{ fontSize: "2rem" }} />
            </IconButton>

            {/* Search Bar */}
            <input
              className="search-input"
              type="text"
              placeholder={`Search for ${searchCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Dropdown for Category */}
            <select
              className="search-category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="recipe">Recipe</option>
              <option value="username">Username</option>
              <option value="groupname">Group Name</option>
            </select>

            {/* Dropdown for Sort Order */}
            <select
              className="sort-category"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            {/* Search Icon */}
            <button className="search-button" onClick={handleSearch}>
              🔍
            </button>

            {/* Profile Icon */}
            <IconButton onClick={handleProfile} style={{ marginLeft: "auto" }}>
              <AccountCircle sx={{ fontSize: "2rem" }} />
            </IconButton>
          </div>
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
                    <Typography style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
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
