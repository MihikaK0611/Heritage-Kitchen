import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
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

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usersRef = collection(db, "users");
      await addDoc(usersRef, { email, password });
      alert("Account created successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={3} align="center">
          Create Account
        </Typography>
        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Sign Up
          </Button>
        </Box>
        <Typography variant="body2" mt={3} align="center">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Log In
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Signup;
