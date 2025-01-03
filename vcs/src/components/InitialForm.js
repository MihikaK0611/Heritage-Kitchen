import React, { useState } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/InitialForm.css";

function InitialForm({ onComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    components: 0,
    collaborators: "",
    permission: "view", // Default permission
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCollaborators = async () => {
    const collaboratorEmails = formData.collaborators
      .split(",")
      .map((email) => email.trim());
    const usersRef = collection(db, "users");

    for (let email of collaboratorEmails) {
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validCollaborators = await validateCollaborators();
    if (!validCollaborators) {
      setError("One or more collaborators are not registered.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "recipes"), {
        name: formData.name,
        components: parseInt(formData.components),
        collaborators: formData.collaborators.split(",").map((email) => email.trim()),
        permission: formData.permission,
        componentsData: [], // Initial empty list
      });
      alert("Initial recipe details saved successfully!");
      onComplete(docRef.id); // Pass the recipe ID to the parent
    } catch (error) {
      console.error("Error saving initial recipe: ", error);
      alert("Failed to save recipe. Please try again.");
    }
  };

  return (
    <div className="initial-form-container">
      <div className="popup">
        <form onSubmit={handleSubmit}>
          <h2>Add Recipe</h2>
          <label>Recipe Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Number of Components:</label>
          <input
            name="components"
            type="number"
            value={formData.components}
            onChange={handleChange}
            required
          />
          <label>Collaborators (comma-separated emails):</label>
          <input
            name="collaborators"
            value={formData.collaborators}
            onChange={handleChange}
            required
          />
          <label>Permission:</label>
          <select
            name="permission"
            value={formData.permission}
            onChange={handleChange}
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default InitialForm;


