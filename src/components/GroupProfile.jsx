import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

const GroupProfile = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [recipes, setRecipes] = useState([]);
  const [originalRecipes, setOriginalRecipes] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = location.state?.groupData;
    if (data) {
      setGroupData(data);
    } else {
      const storedGroups = JSON.parse(localStorage.getItem("groups")) || [];
      const groupName = location.state?.groupName;
      const group = storedGroups.find((g) => g.groupName === groupName);

      if (group) {
        setGroupData(group);
      } else {
        console.warn("No group data found!");
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (groupData) {
      const initialRecipes = [
        { name: "Hot Water", description: "Simple recipe" },
        { name: "Cold Coffee", description: "Refreshing drink" },
      ];
      setRecipes(initialRecipes);
      setOriginalRecipes(initialRecipes);
    }
  }, [groupData]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleProfile = () => navigate("/profile");
  const handleHomePage = () => navigate("/home");
  const handleAddRecipe = () => navigate("/addrecipe");
  const handleCreateGroup = () => navigate("/creategroup");

  const handleSearch = () => {
    let filteredRecipes = [...originalRecipes];

    if (searchQuery) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setRecipes(
      sortOrder === "asc"
        ? filteredRecipes.sort((a, b) => a.name.localeCompare(b.name))
        : filteredRecipes.sort((a, b) => b.name.localeCompare(a.name))
    );
  };

  if (!groupData) return <div>No group data provided!</div>;

  return (
    <div className="group-profile-page">
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
            <li onClick={handleProfile}>Profile</li>
            <li>Settings</li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Group Section */}
        <div className="group-section" style={{ display: "flex", justifyContent: "flex-start" }}>
          {/* Avatar and Join Button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "30px" }}>
            <div className="group-avatar" style={{ fontSize: "5rem", marginBottom: "10px" }}>
              👥
            </div>
            <button className="join-button" style={{ padding: "8px 16px" }}>Join Group</button>
          </div>

          {/* Group Info */}
          <div style={{ flex: 1 }}>
            <h1>{groupData.groupName}</h1>
            <p className="group-description" style={{ margin: "10px 0" }}>
              {groupData.description}
            </p>
            <div className="group-stats" style={{ marginBottom: "10px" }}>
              <span
                onClick={() => setShowMembers(!showMembers)}
                className="clickable"
                style={{ marginRight: "20px" }}
              >
                {groupData.members.length} Members
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr />

        {/* Display List of Members */}
        {showMembers && (
          <div className="list">
            <h4>Members</h4>
            {groupData.members.length > 0 ? (
              <ul>
                {groupData.members.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            ) : (
              <p>No members to display.</p>
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
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

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
        </div>

        {/* Recipes Section */}
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
                    <Typography
                      style={{ fontWeight: "bold", fontSize: "16px" }}
                    >
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

export default GroupProfile;
