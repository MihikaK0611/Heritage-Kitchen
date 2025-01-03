import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const CommitView = ({ recipeId }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const q = query(
          collection(db, "commits"),
          where("final.id", "==", recipeId) // Match commits for this recipe ID
        );
        const querySnapshot = await getDocs(q);
        const commitData = querySnapshot.docs.map((doc) => doc.data());
        setCommits(commitData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching commits:", error);
        setLoading(false);
      }
    };

    fetchCommits();
  }, [recipeId]);

  if (loading) {
    return <p>Loading commit history...</p>;
  }

  if (commits.length === 0) {
    return <p>No commit history available for this recipe.</p>;
  }

  return (
    <div className="commit-view">
      {commits.map((commit, index) => (
        <div key={index} className="commit-item">
          <p><strong>Message:</strong> {commit.msg}</p>
          <p><strong>Initial:</strong> {JSON.stringify(commit.initial, null, 2)}</p>
          <p><strong>Final:</strong> {JSON.stringify(commit.final, null, 2)}</p>
          <p><strong>Edited By:</strong> {commit.editedBy}</p>
          <p><strong>Version:</strong> {commit.version}</p>
          <p><strong>Timestamp:</strong> {new Date(commit.timestamp?.seconds * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommitView;
