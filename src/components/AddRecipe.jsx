import React, { useEffect, useState } from 'react';
import { TextField, Button, IconButton, Select, MenuItem, InputLabel, FormControl, Box, Chip } from "@mui/material";
import { Add, CheckCircle, Menu, AccountCircle, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import "./Profile.css";

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    servings: "",
    ingredients: [],
    type: "",
    nutrition: "",
    directions: "",
    notAllowedFor: "",
    time: "",
    tips: "",
    otherMedia: [],
    permissions: { visibility: "private", editOption: "", tags: [] },
    additionalFields: [],
  });
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [ingredient, setIngredient] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
      try {
        await auth.signOut();
        navigate("/login"); // Redirect to login page after logout
      } catch (err) {
        console.error("Error logging out:", err);
      }
    };

  const handleProfile = async () => {
    navigate("/profile");
  };

  const handleHomePage = () => {
    navigate("/home"); // Navigate to Home page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = (event) => {
    if (event.key === "Enter" && ingredient.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.trim()],
      }));
      setIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing !== ingredientToRemove),
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      otherMedia: [...prev.otherMedia, ...files],
    }));
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: [...prev.additionalFields, { fieldName: "", fieldContent: "" }],
    }));
  };

  const handleAdditionalFieldChange = (index, type, value) => {
    const updatedFields = [...formData.additionalFields];
    updatedFields[index][type] = value;
    setFormData((prev) => ({ ...prev, additionalFields: updatedFields }));
  };

  const removeField = (index) => {
    const updatedFields = formData.additionalFields.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, additionalFields: updatedFields }));
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to submit a recipe.");
      return;
    }

    try {
      // Upload files to Firebase Storage and get their URLs
      const mediaURLs = await Promise.all(
        formData.otherMedia.map(async (file) => {
          const fileRef = ref(storage, `recipes/${auth.currentUser.uid}/${file.name}`);
          await uploadBytes(fileRef, file);
          const fileURL = await getDownloadURL(fileRef);
          return fileURL;
        })
      );

      // Save the recipe data to Firestore
      const docRef = await addDoc(collection(db, "recipes"), {
        ...formData,
        otherMedia: mediaURLs,
        userId: auth.currentUser.uid,
      });

      console.log("Recipe added successfully:", docRef.id);
      setSuccessMessage("Recipe submitted successfully!");
    } catch (error) {
      console.error("Error adding recipe:", error);
      setSuccessMessage("Failed to save recipe. Please try again.");
    }
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      otherMedia: prev.otherMedia.filter((_, i) => i !== index),
    }));
  };

  return (
    <div style={{ display: "flex" }}>
      {dashboardOpen && (
        <div className="sidebar">
          <div style={{ cursor: "pointer" }} onClick={() => setDashboardOpen(!dashboardOpen)} className="sidebar-logo">
            🍳
          </div>
          <ul className="sidebar-menu">
            <li onClick={handleHomePage}>Home</li>
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
      <div style={{ flex: 1, padding: 20 }}>
        {!dashboardOpen && (
          <IconButton style={{ float: "left" }} onClick={() => setDashboardOpen(!dashboardOpen)}>
            <Menu sx={{ fontSize: "2rem" }} />
          </IconButton>
        )}
        <IconButton style={{ float: "right" }} onClick={() => navigate("/profile")}>
          <AccountCircle sx={{ fontSize: "2rem" }} />
        </IconButton>
        <h1>Add Recipe</h1>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", margin: "0 auto", padding: 2 }}>
          <TextField label="Name" name="name" onChange={handleInputChange} fullWidth required />
          <TextField label="Description" name="description" onChange={handleInputChange} fullWidth required />
          <TextField label="Servings" name="servings" onChange={handleInputChange} fullWidth />
          <TextField
            label="Add an Ingredient"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            onKeyDown={handleAddIngredient}
            fullWidth
            placeholder="Press Enter to add"
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {formData.ingredients.map((ing, index) => (
              <Chip key={index} label={ing} onDelete={() => handleRemoveIngredient(ing)} color="primary" />
            ))}
          </Box>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Permissions</InputLabel>
            <Select
              name="permissions.visibility"
              value={formData.permissions.visibility}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  permissions: { ...prev.permissions, visibility: e.target.value },
                }))
              }
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
          </FormControl>
          {formData.permissions.visibility === "public" && (
            <TextField
              label="Who Can Edit"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  permissions: { ...prev.permissions, editOption: e.target.value },
                }))
              }
              placeholder="Enter usernames/groups"
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim() !== "") {
                  setFormData((prev) => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      tags: [...prev.permissions.tags, e.target.value.trim()],
                    },
                  }));
                  e.target.value = "";
                }
              }}
            />
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData.permissions.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() =>
                  setFormData((prev) => ({
                    ...prev,
                    permissions: {
                      ...prev.permissions,
                      tags: prev.permissions.tags.filter((t) => t !== tag),
                    },
                  }))
                }
              />
            ))}
          </Box>

          {/* Render additional fields */}
          {formData.additionalFields.map((field, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Field Name"
                value={field.fieldName}
                onChange={(e) => handleAdditionalFieldChange(index, "fieldName", e.target.value)}
                fullWidth
                sx={{ flex: 1 }}
              />
              <TextField
                label="Field Content"
                value={field.fieldContent}
                onChange={(e) => handleAdditionalFieldChange(index, "fieldContent", e.target.value)}
                fullWidth
                sx={{ flex: 3 }}
              />
              <IconButton onClick={() => removeField(index)}>
                <Close sx={{ color: "red" }} />
              </IconButton>
            </Box>
          ))}

          <Button onClick={addCustomField} startIcon={<Add />} sx={{ alignSelf: "center", margin: "0 auto" }}>
            Add More Fields
          </Button>

          <Button variant="contained" component="label" sx={{ alignSelf: "flex-start" }}>
            Add Media
            <input type="file" multiple hidden onChange={handleFileUpload} />
          </Button>

          {/* Display the selected media */}
          {formData.otherMedia.length > 0 && (
            <Box sx={{ marginTop: 1, fontSize: "0.875rem", color: "gray", alignSelf: "flex-start" }}>
              <ul style={{ paddingLeft: 0 }}>
                {formData.otherMedia.map((file, index) => (
                  <li key={index} style={{ listStyleType: "none", marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                    {file.name}
                    <IconButton onClick={() => handleRemoveFile(index)} sx={{ marginLeft: "8px" }}>
                      <Close sx={{ color: "red", fontSize: "1rem" }} />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          <Box sx={{ position: "fixed", bottom: 20, right: 20, display: "flex", alignItems: "center", gap: 0.1, cursor: "pointer" }} onClick={handleSubmit}>
            <span style={{ fontWeight: "bold" }}>Submit</span>
            <IconButton>
              <CheckCircle sx={{ fontSize: 30, color: "green" }} />
            </IconButton>
          </Box>
        </Box>
      </div>

      {successMessage && alert(successMessage)}
    </div>
  );
};

export default AddRecipe;
