import "./App.css";
import { useEffect } from "react";

import { useApp } from "./context/AppContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Events from "./pages/Events";
import Calendar from "./pages/Calendar";
import Hackathons from "./pages/Hackathons";
import QnA from "./pages/QnA";
import Notes from "./pages/Notes";
import Poll from "./pages/Poll";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function App() {
  const { user, darkMode } = useApp();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Header />
          <main className="content-scroll">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/events" element={<Events />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/hackathons" element={<Hackathons />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/poll" element={<Poll />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
            <Footer />
          </main>
          <MobileNav />
        </div>
      </div>
    </Router>
  );
}

export default App;
