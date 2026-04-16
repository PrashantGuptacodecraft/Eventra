import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Header = () => {
  const { user, logout, darkMode, setDarkMode } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoPanel, setInfoPanel] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setInfoPanel(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    setInfoPanel(null);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setInfoPanel(null);
    navigate("/login");
  };

  return (
    <header className="header-glass px-3 py-2">
      <div className="header-shell d-flex align-items-center justify-content-between gap-3">

        {/* Nav */}
        <ul className="nav header-nav gap-2 mb-0">
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/dashboard")}>Home</button></li>
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/qna")}>Q&A</button></li>
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/notes")}>Notes</button></li>
          <li><button className="nav-link header-link btn btn-link p-0" onClick={() => goTo("/poll")}>Poll</button></li>
        </ul>

        {/* Right */}
        <div className="header-actions d-flex align-items-center gap-2 ms-auto">

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
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setInfoPanel((current) =>
                      current === "settings" ? null : "settings",
                    )
                  }
                >
                  Settings
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setInfoPanel((current) =>
                      current === "faqs" ? null : "faqs",
                    )
                  }
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setInfoPanel((current) =>
                      current === "report" ? null : "report",
                    )
                  }
                >
                  Report Issue
                </button>
              </li>
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
              {infoPanel === "settings" ? (
                <>
                  <li><hr className="dropdown-divider" /></li>
                  <li className="dropdown-item-text user-menu-panel-title">
                    Settings
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    About App
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    Data Reset
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    Notification Settings
                  </li>
                  <li className="dropdown-item-text user-menu-panel-note">
                    Available in future updates.
                  </li>
                </>
              ) : null}
              {infoPanel === "faqs" ? (
                <>
                  <li><hr className="dropdown-divider" /></li>
                  <li className="dropdown-item-text user-menu-panel-title">
                    FAQs
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    How to add tasks?
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    How to join events?
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    How to reset password?
                  </li>
                  <li className="dropdown-item-text user-menu-panel-text">
                    How to earn points?
                  </li>
                </>
              ) : null}
              {infoPanel === "report" ? (
                <>
                  <li><hr className="dropdown-divider" /></li>
                  <li className="dropdown-item-text user-menu-panel-title">
                    Report Issue
                  </li>
                  <li className="dropdown-item-text user-menu-panel-note">
                    Issue reporting will be available in future updates.
                  </li>
                </>
              ) : null}
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
