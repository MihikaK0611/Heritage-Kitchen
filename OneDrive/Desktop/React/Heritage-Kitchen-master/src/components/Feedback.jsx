import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    updates: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        feedback: "",
        updates: false,
      });
    }, 3000); // Reset form after 3 seconds
  };

  return (             

    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundImage: "linear-gradient(to right, #f8f9fa, #e9ecef)",
        }}
      >
        <Typography
          variant="h5"
          mb={3}
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            animation: submitted ? "fade-in 0.5s ease-in-out" : undefined,
          }}
        >
          Help us improve by sharing your thoughts
        </Typography>
        {submitted ? (
          <Box
            sx={{
              textAlign: "center",
              color: "green",
              animation: "fade-in 0.5s ease-in-out",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 50, mb: 2, color: "#4caf50" }}
            />
            <Typography variant="h6">Thank you for your feedback!</Typography>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              animation: "slide-in 0.5s ease-in-out",
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <TextField
              label="Feedback"
              name="feedback"
              multiline
              rows={4}
              value={formData.feedback}
              onChange={handleChange}
              required
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="updates"
                  checked={formData.updates}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="I would like to receive updates via email"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<SendIcon />}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              Submit Feedback
            </Button>
          </Box>
        )}
      </Paper>
      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-in {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Feedback;