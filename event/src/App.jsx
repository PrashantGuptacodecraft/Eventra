import "./App.css";

import { useApp } from "./context/AppContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
// import Toast   from './components/Toast'

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

// import { useState } from 'react'

function App() {
  // const[selectedTab,setSelectedTab]=useState("Tasks")
  const { notes } = useApp();

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/qna" element={<QnA />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
