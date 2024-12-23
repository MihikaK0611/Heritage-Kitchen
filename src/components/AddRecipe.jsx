import React, { useState } from "react";
import { TextField, Button, IconButton, Select, MenuItem, InputLabel, FormControl, Box, Chip } from "@mui/material";
import { Add, CheckCircle, Menu, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth } from '../firebase';

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    servings: "",
    ingredients: "",
    type: "",
    nutrition: "",
    directions: "",
    notAllowedFor: "",
    time: "",
    tips: "",
    otherMedia: [],
    permissions: { visibility: "private", editOption: "", tags: [] },
    additionalFields: []
  });
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleProfile = async () => {
    try {
      await auth.signOut();
      navigate("/profile"); // Redirect to profile page
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const IngredientsInput = ({ handleInputChange }) => {
    const [ingredient, setIngredient] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);

    // Handle input change
    const handleInputChangeLocal = (event) => {
      setIngredient(event.target.value);  // Update the local state for the ingredient
      if (handleInputChange) {
        handleInputChange(event);  // Call the global input change handler if provided
      }
    };

    // Handle adding an ingredient
    const handleAddIngredient = (event) => {
      if (event.key === 'Enter' && ingredient.trim() !== '') {
        setIngredientsList((prevList) => [...prevList, ingredient]);
        setIngredient(''); // Clear input after adding
      }
    };

    // Handle removing an ingredient
    const handleRemoveIngredient = (ingredientToRemove) => {
      setIngredientsList(ingredientsList.filter((ing) => ing !== ingredientToRemove));
    };

    return (
      <div>
        <TextField
          label="Ingredients"
          value={ingredient}
          onChange={handleInputChangeLocal} // Update local ingredient state
          onKeyDown={handleAddIngredient}  // Add ingredient on Enter key press
          fullWidth
          required
          sx={{ marginBottom: '10px'}}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {ingredientsList.map((ing, index) => (
            <Chip
              key={index}
              label={ing}
              onDelete={() => handleRemoveIngredient(ing)}
              color="primary"
            />
          ))}
        </Box>
      </div>
    );
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      otherMedia: [...prev.otherMedia, ...files],
    }));
  };

  // Add new custom field
  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: [...prev.additionalFields, ""],
    }));
  };

  // Save form data to Firestore
  const handleSubmit = async () => {
    try {
      // Save form data
      const docRef = await addDoc(collection(db, "recipes"), {
        ...formData,
        userId: auth.currentUser.uid, // Associate with logged-in user
      });

      // Save media files
      formData.otherMedia.forEach(async (file) => {
        const fileRef = ref(storage, `recipes/${docRef.id}/${file.name}`);
        await uploadBytes(fileRef, file);
      });

      navigate(`/preview/${docRef.id}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      {dashboardOpen && (
        <div className="sidebar">
          <div style={{ cursor: 'pointer'}} onClick={() => setDashboardOpen(!dashboardOpen)} className="sidebar-logo">🍳</div>
          <ul className="sidebar-menu">
            <li>Home</li>
            <li>Add Recipe</li>
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
        {/* Toggle Dashboard */}
        {!dashboardOpen && (
          <IconButton style={{ float: 'left'}} onClick={() => setDashboardOpen(!dashboardOpen)}>
            <Menu sx={{ fontSize: '2rem' }}/>
          </IconButton>
        )}

        {/* Profile Icon */}
        <IconButton style={{ float: "right"}} onClick={() => navigate("/profile")}>
          <AccountCircle sx={{ fontSize: '2rem' }}/>
        </IconButton>

        {/* Recipe Form */}
        <h1>Add Recipe</h1>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2, // Adds space between each form field
            width: '100%', // Ensure the form takes the full width of its parent
            maxWidth: '100%', // Optional: Set max width for form to look more structured
            margin: '0 auto', // Centers the form on the page
            marginBottom: '17px',
          }}
        >
          <TextField
            label="Name"
            name="name"
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: '5px' }} // Adds bottom margin to each field
          />
          <TextField
            label="Description"
            name="description"
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ marginBottom: '5px' }}
          />
          <TextField
            label="Servings"
            name="servings"
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: '5px' }}
          />
          <IngredientsInput handleInputChange={handleInputChange} />
        </Box>
        <FormControl fullWidth>
          <InputLabel>Permissions</InputLabel>
          <Select
            name="permissions.visibility"
            value={formData.permissions.visibility}
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              permissions: { ...prev.permissions, visibility: e.target.value },
            }))}
          >
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="public">Public</MenuItem>
          </Select>
        </FormControl>

        {formData.permissions.visibility === "public" && (
          <div>
            <TextField
              label="Who Can Edit (Usernames/Groups)"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  permissions: { ...prev.permissions, editOption: e.target.value },
                }))
              }
              fullWidth
            />
          </div>
        )}

        {/* File Upload */}
        <Button variant="contained" component="label">
          Add Media
          <input type="file" multiple hidden onChange={handleFileUpload} />
        </Button>

        {/* Add Custom Fields */}
        {formData.additionalFields.map((_, index) => (
          <TextField
            key={index}
            label={`Custom Field ${index + 1}`}
            onChange={(e) => {
              const newFields = [...formData.additionalFields];
              newFields[index] = e.target.value;
              setFormData((prev) => ({ ...prev, additionalFields: newFields }));
            }}
            fullWidth
          />
        ))}
        <Button onClick={addCustomField} startIcon={<Add />}>
          Add More Fields
        </Button>

        {/* Submit Button */}
        <div
          onClick={handleSubmit}
          style={{
            position: 'fixed',
            bottom: '20px', // Adjust the space from the bottom
            right: '20px',  // Adjust the space from the right
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem', // Space between the text and the icon
            fontWeight: 'bold', // Make the text bold
            cursor: 'pointer',
          }}
        >
          Submit
          <IconButton>
            <CheckCircle style={{ fontSize: 30, color: 'green' }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
