import { doc, updateDoc, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchRecipes = async () => {
  const querySnapshot = await getDocs(collection(db, "recipes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateRecipe = async (recipeId, componentsData) => {
  const recipeRef = doc(db, "recipes", recipeId);

  // Fetch the current recipe to get its version
  const recipeSnapshot = await getDocs(recipeRef);
  const currentVersion = recipeSnapshot.exists() ? recipeSnapshot.data().version || 0 : 0;

  await updateDoc(recipeRef, {
    componentsData,
    version: currentVersion + 1, // Increment version
  });

  // Save commit data to the 'commits' collection
  const commitData = {
    msg: "Recipe updated",
    initial: {}, // Fill with the initial state (optional)
    final: { id: recipeId, componentsData },
    editedBy: "editor@example.com", // Replace with actual user email
    version: currentVersion + 1,
    timestamp: serverTimestamp(),
  };
  await addCommit(commitData);
};


export const addCommit = async (commitData) => {
  const commitRef = collection(db, "commits");
  await addDoc(commitRef, {
    ...commitData,
    timestamp: serverTimestamp(), // Add server timestamp
  });
};

export const getRecipeCommits = async (recipeId) => {
  const querySnapshot = await getDocs(collection(db, "commits"));
  return querySnapshot.docs
    .map((doc) => doc.data())
    .filter((commit) => commit.final.id === recipeId);
};
