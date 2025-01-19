import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { Menu, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const CreateGroup = () => {
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [privacy, setPrivacy] = useState("public");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleProfile = async () => {
    navigate("/profile");
  };

  const handleHomePage = () => {
    navigate("/home");
  };

  const handleAddRecipe = () => {
    navigate("/addrecipe");
  };

  const handleAddMember = () => {
    if (newMember.trim() && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  const handleDeleteMember = (memberToDelete) => {
    setMembers(members.filter((member) => member !== memberToDelete));
  };

  const handleCreateGroup = () => {
    const groupData = { groupName, description, members, privacy };
    navigate("/groupprofile", { state: { groupData } });
  };  

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      {dashboardOpen && (
        <div className="sidebar">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setDashboardOpen(!dashboardOpen)}
            className="sidebar-logo"
          >
            🍳
          </div>
          <ul className="sidebar-menu">
            <li onClick={handleHomePage}>Home</li>
            <li onClick={handleAddRecipe}>Add Recipe</li>
            <li>Create Group</li>
            <li onClick={handleProfile}>Profile</li>
            <li>Settings</li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#f4f6f8", // Same shade of gray as the dashboard
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                onClick={() => setDashboardOpen(!dashboardOpen)}
                style={{ marginBottom: "20px" }}
              >
                <Menu sx={{ fontSize: "2rem" }} />
              </IconButton>
              <IconButton
                onClick={handleProfile}
                style={{
                  marginBottom: "20px",
                  borderRadius: "50%", // Ensures circular shape
                  overflow: "hidden", // Prevents overflow effects
                }}
              >
                <AccountCircle sx={{ fontSize: "2rem" }} />
              </IconButton>
            </div>

            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
              Create a New Group
            </Typography>
            <form>
              <TextField
                label="Group Name"
                variant="outlined"
                fullWidth
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                sx={{
                  marginBottom: "15px",
                  background: "#fff", // White background for the input box
                  borderRadius: "4px",
                }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  marginBottom: "15px",
                  background: "#fff", // White background for the input box
                  borderRadius: "4px",
                }}
              />
              <Box sx={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <TextField
                  label="Add Member"
                  variant="outlined"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                  sx={{
                    flex: 2,
                    background: "#fff", // White background for the input box
                    borderRadius: "4px",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddMember}
                  sx={{
                    flex: 0.5,
                    height: "56px", // Matching the height of the input field
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#115293",
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ marginBottom: "15px" }}>
                {members.map((member, index) => (
                  <Chip
                    key={index}
                    label={member}
                    onDelete={() => handleDeleteMember(member)}
                    sx={{
                      margin: "5px",
                      backgroundColor: "white", // White background for chips
                      color: "#1976d2",
                      border: "1px solid #1976d2",
                      "&:hover": { backgroundColor: "#f4f6f8" },
                    }}
                  />
                ))}
              </Box>
              <RadioGroup
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                sx={{
                    marginBottom: "15px",
                    display: "flex",
                    flexDirection: "row", // Align horizontally
                    gap: "50px", // Space between radio buttons
                    justifyContent: "flex-start", // Align to the left
                  }}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Private"
                />
              </RadioGroup>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateGroup}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                Create Group
              </Button>
            </form>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default CreateGroup;
