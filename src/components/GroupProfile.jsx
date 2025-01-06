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
import { AccountCircle, Menu } from "@mui/icons-material";
import "./Profile.css";

const GroupProfile = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [recipes, setRecipes] = useState([]);
  const [originalRecipes, setOriginalRecipes] = useState([]);
  const [occasionFilter, setOccasionFilter] = useState("");
  const [dietFilter, setDietFilter] = useState("");
  const [ingredientFilter, setIngredientFilter] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [searchCategory, setSearchCategory] = useState("recipe"); // Added searchCategory state

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
          {
            name: "Hot Water",
            description: "A basic, yet essential recipe. Simply boiling water for hydration or other purposes.",
            occasion: "Anytime",
            diet: "Universal",
            ingredients: ["Water"],
          },
          {
            name: "Cold Coffee",
            description: "A refreshing drink perfect for hot days or when you're craving a sweet, chilled beverage. Made with brewed coffee, milk, and ice.",
            occasion: "Anytime",
            diet: "Vegetarian",
            ingredients: ["Coffee", "Milk", "Ice", "Sugar"],
          },
          {
            name: "Pasta Primavera",
            description: "A vibrant Italian dish made with fresh seasonal vegetables and pasta, lightly tossed in olive oil and garlic. Perfect for a light dinner.",
            occasion: "Dinner",
            diet: "Vegetarian",
            ingredients: ["Pasta", "Tomato", "Bell Pepper", "Zucchini", "Olive Oil", "Garlic"],
          },
          {
            name: "Chicken Curry",
            description: "A rich and flavorful curry made with tender chicken, simmered in a mixture of spices, and served with steamed rice or bread. A hearty meal for lunch.",
            occasion: "Lunch",
            diet: "Non-Vegetarian",
            ingredients: ["Chicken", "Curry Powder", "Onions", "Garlic", "Tomatoes", "Ginger", "Coconut Milk"],
          },
          {
            name: "Chocolate Cake",
            description: "A decadent and moist dessert, made with rich cocoa, butter, and flour. Perfect for birthdays, celebrations, or when you just need something sweet.",
            occasion: "Dessert",
            diet: "Vegetarian",
            ingredients: ["Flour", "Cocoa Powder", "Sugar", "Butter", "Eggs", "Baking Powder", "Vanilla"],
          },
          {
            name: "Vegetable Stir-Fry",
            description: "A healthy and quick stir-fry featuring a mix of vegetables sautéed in sesame oil, with a light soy sauce dressing. Great as a side or main dish.",
            occasion: "Dinner",
            diet: "Vegetarian",
            ingredients: ["Broccoli", "Carrot", "Bell Pepper", "Onion", "Garlic", "Sesame Oil", "Soy Sauce"],
          },
          {
            name: "Spaghetti Bolognese",
            description: "A classic Italian pasta dish, with a rich and savory meat sauce made from ground beef, tomatoes, and herbs. Serve with a generous amount of parmesan.",
            occasion: "Dinner",
            diet: "Non-Vegetarian",
            ingredients: ["Spaghetti", "Ground Beef", "Tomatoes", "Onion", "Garlic", "Herbs", "Parmesan Cheese"],
          },
          {
            name: "Fruit Salad",
            description: "A refreshing and healthy dessert or snack made with a variety of fresh fruits, tossed together and drizzled with honey or lime juice for added flavor.",
            occasion: "Dessert",
            diet: "Vegetarian",
            ingredients: ["Apple", "Banana", "Strawberries", "Orange", "Grapes", "Honey", "Lime Juice"],
          },
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

    if (occasionFilter) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.occasion?.toLowerCase().includes(occasionFilter.toLowerCase())
      );
    }

    if (dietFilter) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.diet?.toLowerCase().includes(dietFilter.toLowerCase())
      );
    }

    if (ingredientFilter) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.ingredients?.some((ingredient) =>
          ingredient.toLowerCase().includes(ingredientFilter.toLowerCase())
        )
      );
    }

    setRecipes(
      sortOrder === "asc"
        ? filteredRecipes.sort((a, b) => a.name.localeCompare(b.name))
        : filteredRecipes.sort((a, b) => b.name.localeCompare(a.name))
    );
  };

  useEffect(() => {
    handleSearch(); // Ensure search is updated whenever any filter or query changes
  }, [searchQuery, sortOrder, occasionFilter, dietFilter, ingredientFilter]);

  if (!groupData) return <div>No group data provided!</div>;

  return (
    <div className={`group-profile-page ${!dashboardOpen ? "sidebar-hidden" : ""}`}>
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        {/* Group Section */}
        <div className="group-section" style={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "50px",
            }}
          >
            <div className="group-avatar" style={{ fontSize: "5rem", marginBottom: "10px" }}>
              👥
            </div>
            <button
              className="join-button"
              style={{
                padding: "8px 16px",
                backgroundColor: "#2F58D4",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#315f76"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2F58D4"}
            >
              Join Group
            </button>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <h1>{groupData.groupName}</h1>

            {/* Box for the description */}
            <div
              style={{
                width: "100%", 
                height: "100px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "auto",
              }}
            >
              <p className="group-description" style={{ margin: "0" }}>
                {groupData.description || "No description available."} {/* Fallback message */}
              </p>
            </div>
            
            <br></br>

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

        <hr />
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
              {/* <option value="username">Username</option> */}
              {/* <option value="groupname">Group Name</option> */}
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
