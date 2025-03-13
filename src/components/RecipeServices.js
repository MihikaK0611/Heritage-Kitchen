import { 
  doc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from 'firebase/auth';


export const fetchRecipes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipes = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched recipes:", recipes);
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Could not fetch recipes");
  }
};

const getLatestVersion = async (recipeId) => {
  try {
    const commitsRef = collection(db, "commits");
    const q = query(commitsRef, where("final.recipeId", "==", recipeId), orderBy("version", "desc"), limit(1));
    const commitSnapshot = await getDocs(q);

    if (!commitSnapshot.empty) {
      const latestCommit = commitSnapshot.docs[0].data();
      console.log(`Latest version for recipeId ${recipeId}: ${latestCommit.version}`);
      return latestCommit.version; 
    }
    console.log(`No commits found for recipeId ${recipeId}. Starting at version 1.`);
    return 1; 
  } catch (error) {
    console.error("Error getting latest version:", error);
    throw new Error("Could not get latest version");
  }
};


export const updateRecipe = async (recipeId, componentsData) => {
  const recipeRef = doc(db, "recipes", recipeId);
  
  try {
    const latestVersion = await getLatestVersion(recipeId);

    
    console.log(`Latest version before update of recipeId ${recipeId}:`, latestVersion);
    
    const newVersion = latestVersion + 1; 

    const recipeSnapshot = await getDoc(recipeRef);
    if (!recipeSnapshot.exists()) {
      throw new Error("Recipe not found");
    }
    
    const currentRecipeData = recipeSnapshot.data();
    console.log(`Updating recipe ${recipeId}: Previous version: ${latestVersion}, New version: ${newVersion}`);

    await updateDoc(recipeRef, {
      componentsData,
      version: newVersion,
    });

    const auth = getAuth();
    const currentUser = auth.currentUser;

    const commitData = {
      msg: `Edited recipe: ${currentRecipeData.name || "Unnamed Recipe"}`,
      initial: currentRecipeData,
      final: { recipeId, componentsData, ...currentRecipeData },
      editedBy: currentUser ? currentUser.email : "Anonymous",
      version: newVersion,
      timestamp: serverTimestamp(),
      type: "edited",
    };

    console.log("Adding commit:", commitData);
    await addCommit(commitData);
    console.log(`Commit added for recipe ${recipeId} with version ${newVersion}`);

  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Could not update recipe");
  }
};


export const addCommit = async (commitData) => {
  const commitRef = collection(db, "commits");
  try {
    await addDoc(commitRef, {
      ...commitData,
      timestamp: serverTimestamp(),
    });
    console.log(`Commit saved:`, commitData);
  } catch (error) {
    console.error("Error adding commit:", error);
    throw new Error("Could not add commit");
  }
};

export const getRecipeCommits = async (recipeId) => {
  try {
    const commitsRef = collection(db, "commits");
    const q = query(commitsRef, where("final.recipeId", "==", recipeId), orderBy("version", "asc"));
    const querySnapshot = await getDocs(q);
    const commits = querySnapshot.docs.map((doc) => doc.data());
    console.log(`Retrieved commits for recipeId ${recipeId}:`, commits);
    return commits;
  } catch (error) {
    console.error("Error retrieving recipe commits:", error);
    throw new Error("Could not retrieve recipe commits");
  }
};


