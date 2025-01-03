import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Successful login
        const userData = querySnapshot.docs[0].data();
        onLogin(userData); // Pass user data to parent component for further processing (if needed)
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
