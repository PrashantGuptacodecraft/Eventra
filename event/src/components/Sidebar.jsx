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
    { id: "qna", label: "Q&A", path: "/qna" },
    { id: "notes", label: "Notes", path: "/notes" },
    { id: "profile", label: "Profile", path: "/profile" },
  ];

  const adminLinks = [
    { id: "admin", label: "Admin Dashboard", path: "/admin" },
    { id: "events", label: "Manage Events", path: "/events" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar-shell d-flex flex-column p-3 text-white">
      <div className="sidebar-brand text-center mb-3">
        <div className="sidebar-brand-badge">
          <img
            src="/eventra-logo.jpeg"
            alt="Eventra"
            className="sidebar-brand-image"
          />
        </div>
      </div>

      <hr
        className="sidebar-divider"
        style={{ borderColor: "rgba(255,255,255,0.3)" }}
      />

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

      <div
        className="mt-auto pt-3 border-top"
        style={{ borderColor: "rgba(255,255,255,0.3)" }}
      >
        <button onClick={logout} className="sidebar-btn logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
