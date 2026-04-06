import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Sidebar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const userLinks = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "tasks", label: "Tasks", path: "/tasks" },
    { id: "events", label: "Events", path: "/events" },
    { id: "hackathons", label: "Hackathons", path: "/hackathons" },
    { id: "qna", label: "Q&A", path: "/qna" },
    { id: "notes", label: "Notes", path: "/notes" },
    { id: "profile", label: "Profile", path: "/profile" },
  ];

  const adminLinks = [
    { id: "admin", label: "Admin Dashboard", path: "/admin" },
    { id: "events", label: "Manage Events", path: "/events" },
    { id: "hackathons", label: "Manage Hackathons", path: "/hackathons" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className="d-flex flex-column p-3 text-white"
      style={{
        width: "260px",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff6a00)",
        backgroundSize: "300% 300%",
        animation: "gradientMove 8s ease infinite",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Logo */}
      <h3 className="text-center mb-4 fw-bold">🚀 UniPortal</h3>

      <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

      {/* Links */}
      <div className="d-flex flex-column gap-2 flex-grow-1">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavigation(link.path)}
            className={`sidebar-btn ${
              location.pathname === link.path ? "active" : ""
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div
        className="mt-auto pt-3 border-top"
        style={{ borderColor: "rgba(255,255,255,0.3)" }}
      >
        <button onClick={logout} className="sidebar-btn logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
