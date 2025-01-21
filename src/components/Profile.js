import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Firebase setup
import { useNavigate } from "react-router-dom";
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
import "./Profile.css";

const Profile = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("recipe");
  const [sortOrder, setSortOrder] = useState("asc");

  const [occasionFilter, setOccasionFilter] = useState("");
  const [dietFilter, setDietFilter] = useState("");
  const [ingredientFilter, setIngredientFilter] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser; // Get the currently signed-in user
    if (user) {
      setDisplayName(user.displayName || "Guest");
      // Mock fetching followers, following, and groups from user data
      setFollowers(["user1", "user2", "user3"]); // Replace with actual data
      setFollowing(["user4", "user5"]);
      setGroups(["group1", "group2", "group3"]);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleAddRecipe = () => {
    navigate("/addrecipe"); // Navigate to Add Recipe page
  };

  const handleHomePage = () => {
    navigate("/home"); // Navigate to Home page
  };

  const handleCreateGroup = () => {
    navigate("/creategroup");
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
    <div className={`group-profile-page ${!dashboardOpen ? "sidebar-hidden" : ""}`}>
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
            <li onClick={handleHomePage}>Home</li>
            <li onClick={handleAddRecipe}>Add Recipe</li>
            <li onClick={handleCreateGroup}>Create Group</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* User Section */}
        <div className="user-section">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <input
              type="text"
              className="username-input"
              value={displayName}
              readOnly
            />
            <div className="user-stats">
              <span
                onClick={() => setShowFollowers(!showFollowers)}
                className="clickable"
              >
                {followers.length} Followers
              </span>
              <span
                onClick={() => setShowFollowing(!showFollowing)}
                className="clickable"
              >
                {following.length} Following
              </span>
              <span
                onClick={() => setShowGroups(!showGroups)}
                className="clickable"
              >
                {groups.length} Groups
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr />

        {/* Display Lists of Followers, Following, or Groups */}
        {showFollowers && (
          <div className="list">
            <h4>Followers</h4>
            {followers.length > 0 ? (
              <ul>
                {followers.map((follower, index) => (
                  <li key={index}>{follower}</li>
                ))}
              </ul>
            ) : (
              <p>No followers to display.</p>
            )}
          </div>
        )}

        {showFollowing && (
          <div className="list">
            <h4>Following</h4>
            {following.length > 0 ? (
              <ul>
                {following.map((follow, index) => (
                  <li key={index}>{follow}</li>
                ))}
              </ul>
            ) : (
              <p>Not following anyone yet.</p>
            )}
          </div>
        )}

        {showGroups && (
          <div className="list">
            <h4>Groups</h4>
            {groups.length > 0 ? (
              <ul>
                {groups.map((group, index) => (
                  <li key={index}>{group}</li>
                ))}
              </ul>
            ) : (
              <p>Not part of any groups yet.</p>
            )}
          </div>
        )}

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
                style={{
                  width: "200px",
                  height: "23px",
                  padding: "5px",
                  fontSize: "13px",
                }}
              />
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="content-card">
          <div className="card-content">
            <h3>HOT WATER</h3>
            <p>Description goes here...</p>
          </div>
          <div className="card-image">
            <img
              src="https://via.placeholder.com/100"
              alt="Placeholder"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .group-profile-page {
          display: flex;
          flex-direction: row;
          height: 100vh; /* Ensure full height */
        }
      
        .sidebar {
          width: 250px;
          background-color: #f4f4f4;
          padding: 20px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          height: 100%;
          justify-content: space-between;
          transition: transform 0.3s ease-in-out;
        }
      
        .sidebar-menu li {
          list-style: none;
          margin: 10px 0;
          padding: 10px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
        }
      
        .sidebar-menu li:hover {
          background-color: #2f58d4; /* Highlighted background */
          color: white; /* Change text color to white */
          transform: scale(1.05); /* Slightly scale up the menu item */
        }
      
        .sidebar-logo {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #2f58d4;
          transition: transform 0.3s ease, color 0.3s ease;
        }
      
        .sidebar-logo:hover {
          color: #315f76; /* Darker blue on hover */
          transform: rotate(10deg); /* Slight rotation for a fun effect */
        }
      
        .logout-btn {
          background-color: #d9534f;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
      
        .logout-btn:hover {
          background-color: #c9302c; /* Darker red on hover */
          transform: scale(1.05); /* Slightly scale up */
        }
      `}</style>
    </div>
  );
};

export default Profile;