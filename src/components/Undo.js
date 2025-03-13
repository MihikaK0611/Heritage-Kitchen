/*import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const undoCommit = async (recipeId, currentUser, navigate) => {
  if (!currentUser || !currentUser.email) {
    console.error("Undo failed: User not logged in.");
    return { success: false, message: "User must be logged in to undo." };
  }

  try {
    console.log("Undo requested by:", currentUser.email, "for recipe:", recipeId);
    
    // Fetch the recipe document
    const recipeRef = doc(db, "recipes", recipeId);
    const recipeSnap = await getDoc(recipeRef);

    if (!recipeSnap.exists()) {
      console.error("Recipe not found");
      return { success: false, message: "Recipe not found." };
    }

    const recipeData = recipeSnap.data();
    console.log("Current recipe data:", recipeData);

    // Check if the user is authorized
    if (!recipeData.collaborators.includes(currentUser.email)) {
      console.error("Unauthorized undo attempt by:", currentUser.email);
      return { success: false, message: "Unauthorized: Only collaborators can undo." };
    }

    // Fetch commits, ignoring "Undo" commits
    const commitsRef = collection(db, "commits");
    const commitsQuery = query(commitsRef, where("final.recipeId", "==", recipeId));
    const commitsSnap = await getDocs(commitsQuery);

    let commits = commitsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(commit => commit.type !== "Undo"); // Ignore undo commits

    console.log("Fetched commits (excluding undo commits):", commits);

    if (commits.length <= 1) {
      console.error("Cannot undo: Already at the first version");
      return { success: false, message: "Cannot undo: Already at the first version." };
    }

    // Sort commits by version (higher version = latest), ignoring missing versions
    commits.sort((a, b) => {
      if (!a.version) return 1;  
      if (!b.version) return -1; 
      return b.version - a.version; 
    });

    const latestCommit = commits.shift(); // Remove the latest version
    const previousCommit = commits[0];   // Get the next latest version

    console.log("Latest commit to be deleted:", latestCommit);
    console.log("Reverting to previous commit:", previousCommit);

    // Step 1: Delete the latest commit from the "commits" table
    const latestCommitRef = doc(db, "commits", latestCommit.id);
    await deleteDoc(latestCommitRef);
    console.log("Latest commit deleted successfully.");

    // Step 2: Update the `recipes` table with the previous commit data
    const updatedData = {
      name: previousCommit.final?.name || recipeData.name || "Untitled Recipe",
      description: previousCommit.final?.description || recipeData.description || "",
      componentsData: previousCommit.final?.componentsData || recipeData.componentsData || []
    };

    if (previousCommit.version) {
      updatedData.version = previousCommit.version;
    }

    console.log("Final data for recipe update:", updatedData);
    await updateDoc(recipeRef, updatedData);
    console.log("Recipe updated to previous version.");

    // Step 3: Store Undo action in `undos` table instead of `commits`
    const undosRef = collection(db, "undos");
    const undoData = {
      recipeId: recipeId,
      commitId: latestCommit.id,
      msg: "Undo action performed",
      type: "Undo",
      timestamp: new Date(),
      undoneBy: currentUser.email
    };

    await addDoc(undosRef, undoData);
    console.log("Undo recorded in separate table:", undoData);

    // Navigate to the Navigation page after successful undo
    navigate("/navigation");

    return { success: true, message: "Undo successful." };

  } catch (error) {
    console.error("Error undoing commit:", error);
    return { success: false, message: "Error undoing commit." };
  }
};

export default undoCommit;*/

import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const undoCommit = async (recipeId, currentUser, navigate) => {
  if (!currentUser || !currentUser.email) {
    console.error("Undo failed: User not logged in.");
    return { success: false, message: "User must be logged in to undo." };
  }

  try {
    
    console.log("Undo requested by:", currentUser.email, "for recipe:", recipeId);

    // Fetch the recipe document
    const recipeRef = doc(db, "recipes", recipeId);
    const recipeSnap = await getDoc(recipeRef);

    if (!recipeSnap.exists()) {
      console.error("Recipe not found");
      return { success: false, message: "Recipe not found." };
    }

    const recipeData = recipeSnap.data();
    console.log("Current recipe data:", recipeData);

    // Check if the user is authorized
    if (!recipeData.collaborators.includes(currentUser.email)) {
      console.error("Unauthorized undo attempt by:", currentUser.email);
      return { success: false, message: "Unauthorized: Only collaborators can undo." };
    }

    // Fetch commits, ignoring "Undo" commits
    const commitsRef = collection(db, "commits");
    const commitsQuery = query(commitsRef, where("final.recipeId", "==", recipeId));
    const commitsSnap = await getDocs(commitsQuery);

    let commits = commitsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(commit => commit.type !== "Undo"); // Ignore undo commits

    console.log("Fetched commits (excluding undo commits):", commits);

    if (commits.length <= 1) {
      console.error("Cannot undo: Already at the first version");
      return { success: false, message: "Cannot undo: Already at the first version." };
    }

    // Sort commits by version (higher version = latest), ignoring missing versions
    commits.sort((a, b) => {
      if (!a.version) return 1;  
      if (!b.version) return -1; 
      return b.version - a.version; 
    });

    const latestCommit = commits.shift(); // Remove the latest version
    const previousCommit = commits[0];   // Get the next latest version

    console.log("Latest commit to be deleted:", latestCommit);
    console.log("Reverting to previous commit:", previousCommit);

    // Step 1: Delete the latest commit from the "commits" table
    const latestCommitRef = doc(db, "commits", latestCommit.id);
    await deleteDoc(latestCommitRef);
    console.log("Latest commit deleted successfully.");

    // Step 2: Update the `recipes` table with the previous commit data
    const updatedData = {
      name: previousCommit.final?.name || recipeData.name || "Untitled Recipe",
      description: previousCommit.final?.description || recipeData.description || "",
      componentsData: previousCommit.final?.componentsData || recipeData.componentsData || []
    };

    if (previousCommit.version) {
      updatedData.version = previousCommit.version;
    }

    console.log("Final data for recipe update:", updatedData);
    await updateDoc(recipeRef, updatedData);
    console.log("Recipe updated to previous version.");

    // Step 3: Store Undo action in `undos` table instead of `commits`
    const undosRef = collection(db, "undos");
    const undoData = {
      recipeId: recipeId,
      commitId: latestCommit.id,
      msg: "Undo action performed",
      type: "Undo",
      timestamp: new Date(),
      undoneBy: currentUser.email
    };

    await addDoc(undosRef, undoData);
    console.log("Undo recorded in separate table:", undoData);

    // Navigate back to RecipeView.js (previous page)
    navigate("/recipeView");


    return { success: true, message: "Undo successful." };

  } catch (error) {
    console.error("Error undoing commit:", error.message, error.stack);
    return { success: false, message: "Done." };
  }
};

export default undoCommit;


