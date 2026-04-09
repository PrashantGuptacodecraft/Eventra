import "./App.css";

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
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Events from "./pages/Events";
import Hackathons from "./pages/Hackathons";
import QnA from "./pages/QnA";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function App() {
  const { user } = useApp();

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
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/qna" element={<QnA />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/login"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
