import React, { useState } from "react";
import { useApp } from "../context/AppContext";

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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="changePassword"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="changePassword" className="text-sm">
                Change Password
              </label>
            </div>
            {changePassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <p className="mt-1 text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-gray-900 capitalize">{user.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Points
              </label>
              <p className="mt-1 text-gray-900">{user.points || 0}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {user.points || 0}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.role === "user").length}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
