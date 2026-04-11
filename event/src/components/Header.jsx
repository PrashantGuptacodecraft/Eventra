import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Header = () => {
  const { user, logout, darkMode, setDarkMode } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="header-glass px-3 py-2">
      <div className="d-flex align-items-center justify-content-between">

        {/* Nav */}
        <ul className="nav d-none d-md-flex gap-2 mb-0">
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/dashboard")}>Dashboard</button></li>
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/tasks")}>Tasks</button></li>
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/events")}>Events</button></li>
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/hackathons")}>Hackathons</button></li>
        </ul>

        {/* Right */}
        <div className="d-flex align-items-center gap-2">

          {/* Search */}
          <input
            type="search"
            placeholder="Search..."
            className="form-control search-box-small"
          />

          {/* User */}
          <div className="dropdown position-relative" ref={menuRef}>
            <button
              type="button"
              className="btn p-0 border-0 bg-transparent"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Open user menu"
            >
              <img
                src="https://github.com/mdo.png"
                alt="user"
                width="32"
                height="32"
                className="rounded-circle cursor-pointer"
              />
            </button>

            <ul className={`dropdown-menu dropdown-menu-end shadow-sm user-menu-dropdown ${menuOpen ? "show" : ""}`}>
              <li className="dropdown-item-text fw-bold">
                {user?.name || "User"}
              </li>
              <li className="dropdown-item-text text-muted small">
                {user?.role === "admin" ? "Administrator" : "Student"}
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={() => goTo("/profile")}>Profile</button></li>
              <li><button className="dropdown-item" onClick={() => goTo("/profile")}>Settings</button></li>
              <li><button className="dropdown-item" onClick={() => goTo("/qna")}>Help & Support</button></li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDarkMode((current) => !current);
                    setMenuOpen(false);
                  }}
                >
                  {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
