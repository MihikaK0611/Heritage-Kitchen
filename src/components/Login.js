import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log("Logged in user data:", userData);
        onLogin(userData);
      } else {
        setError("Invalid credentials. Please try again."); // Set error state
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      setError("An error occurred. Please try again."); // Set error message
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={3} align="center">
          Welcome Back
        </Typography>
        {error && ( // Ensure error is only displayed when not empty
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit} // Fixed function name
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" size="large">
            Log In
          </Button>
        </Box>
        <Typography variant="body2" mt={3} align="center">
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
