import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Firebase setup
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [displayName, setDisplayName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("recipe"); // Default category is 'recipe'
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
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

  const handleAddRecipe = async () => {
      try {
        await auth.signOut();
        navigate("/addrecipe"); // Redirect to Add Recipe page
      } catch (err) {
        console.error("Error logging out:", err);
      }
  };

  const handleSearch = () => {
    console.log(`Searching for ${searchQuery} in ${searchCategory}`);
    if (searchCategory === "recipe") {
      console.log(`Sorting order: ${sortOrder}`);
    } else if (searchCategory === "username") {
      // Add logic to search users here
    } else if (searchCategory === "groupname") {
      // Add logic to search groups here
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">🍳</div>
        <ul className="sidebar-menu">
          <li>Home</li>
          <li onClick={handleAddRecipe}>Add Recipe</li>
          <li>Create Group</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>

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
        <div className="search-filter">
          <div className="search-bar">
            <input
              type="text"
              placeholder={`Search for ${searchCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="recipe">Recipe</option>
              <option value="username">Username</option>
              <option value="groupname">Group Name</option>
            </select>
            <button onClick={handleSearch}>🔍</button>
          </div>

          {/* Sort & Filter Button for Recipe Search */}
          {searchCategory === "recipe" && (
            <div className="sort-filter">
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <button onClick={handleSearch}>Sort & Filter</button>
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
    </div>
  );
};

export default Profile;
