import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration (Replace with your actual Firebase configuration)
const firebaseConfig = {
  apiKey: "AIzaSyA3W2fLKpsvEpVVjhkf-iIn9fXwMSlE_KQ",
  authDomain: "heritagekitchen-20424.firebaseapp.com",
  projectId: "heritagekitchen-20424",
  storageBucket: "heritagekitchen-20424.firebasestorage.app",
  messagingSenderId: "1018590066651",
  appId: "1:1018590066651:web:7627051e8659be986759fe",
  measurementId: "G-XP01HE0EXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore references
const recipeCollection = collection(db, "recipes");
const componentCollection = collection(db, "recipe-components");

// Add a recipe to the recipe table
const addRecipe = async (recipeData) => {
  try {
    const formattedData = {
      ...recipeData,
      collaborators: recipeData.collaborators.split(",").map((email) => email.trim()),
    };
    const docRef = await addDoc(recipeCollection, formattedData);
    console.log("Recipe added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding recipe: ", e);
  }
};


// Add recipe components to the recipe-components table
const addRecipeComponent = async (recipeId, componentData) => {
  try {
    const docRef = await addDoc(componentCollection, {
      recipe_id: recipeId,
      ...componentData,
    });
    console.log("Component added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding component: ", e);
  }
};

// Fetch all recipes
const fetchRecipes = async () => {
  try {
    const snapshot = await getDocs(recipeCollection);
    const recipes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return recipes;
  } catch (e) {
    console.error("Error fetching recipes: ", e);
    return [];
  }
};

// Fetch components for a specific recipe
const fetchRecipeComponents = async (recipeId) => {
  try {
    const q = query(componentCollection, where("recipe_id", "==", recipeId));
    const snapshot = await getDocs(q);
    const components = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return components;
  } catch (e) {
    console.error("Error fetching recipe components: ", e);
    return [];
  }
};

// Export functions and Firebase instances
export {
  addRecipe,
  addRecipeComponent,
  fetchRecipes,
  fetchRecipeComponents,
  db,
  app,
  auth,
};


