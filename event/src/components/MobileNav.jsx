import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const MobileNav = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const userLinks = [
    { id: "dashboard", label: "Home", short: "H", path: "/dashboard" },
    { id: "events", label: "Events", short: "E", path: "/events" },
    { id: "tasks", label: "Tasks", short: "T", path: "/tasks" },
    { id: "calendar", label: "Calendar", short: "C", path: "/calendar" },
    { id: "profile", label: "Profile", short: "P", path: "/profile" },
  ];

  const adminLinks = [
    { id: "dashboard", label: "Home", short: "H", path: "/dashboard" },
    { id: "events", label: "Events", short: "E", path: "/events" },
    { id: "calendar", label: "Calendar", short: "C", path: "/calendar" },
    { id: "admin", label: "Admin", short: "A", path: "/admin" },
    { id: "profile", label: "Profile", short: "P", path: "/profile" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {links.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <button
            key={link.id}
            type="button"
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            <span className="mobile-nav-icon">{link.short}</span>
            <span className="mobile-nav-label">{link.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
