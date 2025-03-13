import React, { useState } from 'react';
import './Settings.css';
const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: 'Sam',
    email: 'samy@example.com',
    profilePic: '/api/placeholder/150/150'
  });

  const [recipeHistory, setRecipeHistory] = useState([
    { type: 'edit', recipe: 'Grandma\'s Cookies', date: '2024-01-07', changes: 'Updated ingredients' },
    { type: 'delete', recipe: 'Sunday Pasta', date: '2024-01-06', changes: 'Recipe removed' }
  ]);

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <div className="sidebar-header">
          <h2>Settings</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
          <button
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Change History
          </button>
          <button
            className={`nav-button ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            Group Settings
          </button>
          <button
            className={`nav-button ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & Security
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="content-card">
            <h3 className="card-title">Profile Settings</h3>
            
            <div className="profile-photo-section">
              <div className="photo-container">
                <img
                  src={profileData.profilePic}
                  alt="Profile"
                  className="profile-photo"
                />
                <button className="primary-button">Change Photo</button>
              </div>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>

              <button className="primary-button">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="content-card">
            <h3 className="card-title">Change History</h3>
            <div className="history-container">
              {recipeHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-header">
                    <h4>{item.recipe}</h4>
                    <span className="date">{item.date}</span>
                  </div>
                  <p className="history-description">{item.changes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="content-card">
            <h3 className="card-title">Group Settings</h3>
            <div className="groups-container">
              <div className="group-item">
                <h4>Family Recipes</h4>
                <div className="group-buttons">
                  <button className="secondary-button">Manage Members</button>
                  <button className="danger-button">Leave Group</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="content-card">
            <h3 className="card-title">Privacy & Security</h3>
            <div className="privacy-container">
              <div className="privacy-item">
                <div className="privacy-info">
                  <h4>Recipe Visibility</h4>
                  <p>Control who can see your recipes</p>
                </div>
                <select>
                  <option>Public</option>
                  <option>Friends Only</option>
                  <option>Private</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
