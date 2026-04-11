import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Profile.css";

const Profile = () => {
  const { user, users, setUsers, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    password: "",
  });
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const toggleEditing = () => {
    const nextEditing = !isEditing;
    setIsEditing(nextEditing);
    if (nextEditing) {
      setFormData({
        name: user?.name || "",
        username: user?.username || "",
        password: "",
      });
      setChangePassword(false);
      setNewPassword("");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedUser = {
      ...user,
      name: formData.name,
      username: formData.username,
    };

    if (changePassword && newPassword) {
      updatedUser.password = newPassword;
    }

    // Check if username is taken by another user
    const existing = users.find(
      (u) => u.username === formData.username && u.id !== user.id,
    );
    if (existing) {
      showToast("Username already taken", "error");
      return;
    }

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    setUsers(updatedUsers);
    // Update local user state would be handled by context, but since user is from localStorage, need to save
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    // Removed toast notification for profile updates
    setIsEditing(false);
    setChangePassword(false);
    setNewPassword("");
  };

  return (
    <section className="profile-page p-4 p-md-5">
      <div className="profile-shell">
        <div className="profile-hero-card">
          <div className="profile-avatar-circle">
            {(user?.name || user?.username || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="profile-hero-content">
            <h1>{user?.name || "User Profile"}</h1>
            <p>@{user?.username}</p>
            <div className="profile-badge-row">
              <span className="profile-pill profile-pill-soft">
                {user?.role === "admin" ? "Administrator" : "Student"}
              </span>
              <span className="profile-pill profile-pill-strong">
                {user?.points || 0} points
              </span>
            </div>
          </div>

          <button
            onClick={toggleEditing}
            className={`profile-edit-btn ${isEditing ? "cancel" : "edit"}`}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form-grid">
            <div className="profile-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="profile-input"
              />
            </div>
            <div className="profile-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="profile-input"
              />
            </div>
            <div className="profile-switch-row">
              <input
                type="checkbox"
                id="changePassword"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="profile-checkbox"
              />
              <label htmlFor="changePassword">
                Change Password
              </label>
            </div>
            {changePassword && (
              <div className="profile-field full">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="profile-input"
                />
              </div>
            )}
            <button
              type="submit"
              className="profile-save-btn"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="profile-info-grid">
            <div className="profile-info-card">
              <span>Name</span>
              <p>{user.name}</p>
            </div>
            <div className="profile-info-card">
              <span>Username</span>
              <p>{user.username}</p>
            </div>
            <div className="profile-info-card">
              <span>Role</span>
              <p className="capitalize">{user.role}</p>
            </div>
            <div className="profile-info-card">
              <span>Points</span>
              <p>{user.points || 0}</p>
            </div>
          </div>
        )}
        <div className="profile-stats-card">
          <h2>Account Statistics</h2>
          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <div className="value">{user.points || 0}</div>
              <div className="label">Total Points</div>
            </div>
            <div className="profile-stat-box">
              <div className="value">{users.filter((u) => u.role === "user").length}</div>
              <div className="label">Total Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
