/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getData, saveData, seedData } from "../utils/storage";

seedData();

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => getData("loggedInUser") || null);
  const [darkMode, setDarkMode] = useState(false);

  const [users, setUsers] = useState(() => getData("users") || []);
  const [tasks, setTasks] = useState(() => getData("tasks") || []);
  const [events, setEvents] = useState(() => getData("events") || []);
  const [hackathons, setHackathons] = useState(() => getData("hackathons") || []);
  const [qna, setQna] = useState(() => getData("qna") || []);
  const [notes, setNotes] = useState(() => getData("notes") || []);
  const [feedback, setFeedback] = useState(() => getData("feedback") || []);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    saveData("tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    saveData("events", events);
  }, [events]);

  useEffect(() => {
    saveData("hackathons", hackathons);
  }, [hackathons]);

  useEffect(() => {
    saveData("qna", qna);
  }, [qna]);

  useEffect(() => {
    saveData("notes", notes);
  }, [notes]);

  useEffect(() => {
    saveData("feedback", feedback);
  }, [feedback]);

  useEffect(() => {
    saveData("users", users);
  }, [users]);

  useEffect(() => {
    if (user) {
      saveData("loggedInUser", user);
    }
  }, [user]);

  function showToast(msg, type = "info") {
    const id = Date.now();
    setToasts((current) => [...current, { id, msg, type }]);

    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function addPoints(points) {
    if (!user) return;

    const nextUsers = users.map((item) =>
      item.id === user.id
        ? { ...item, points: (item.points || 0) + points }
        : item,
    );

    const nextUser = nextUsers.find((item) => item.id === user.id);

    setUsers(nextUsers);
    setUser(nextUser);
    saveData("loggedInUser", nextUser);
  }

  function awardDailyTaskCoin(dateKey) {
    if (!user) return false;

    const key = dateKey || new Date().toISOString().slice(0, 10);
    let awarded = false;

    const nextUsers = users.map((item) => {
      if (item.id !== user.id) return item;

      const rewardDates = Array.isArray(item.taskDailyRewardDates)
        ? item.taskDailyRewardDates
        : [];

      if (rewardDates.includes(key)) return item;

      awarded = true;
      return {
        ...item,
        points: (item.points || 0) + 1,
        taskDailyRewardDates: [...rewardDates, key],
      };
    });

    if (!awarded) return false;

    const nextUser = nextUsers.find((item) => item.id === user.id);

    setUsers(nextUsers);
    setUser(nextUser);
    saveData("loggedInUser", nextUser);
    return true;
  }

  function login(username, password) {
    const foundUser = users.find(
      (item) => item.username === username && item.password === password,
    );

    if (!foundUser) return false;

    setUser(foundUser);
    saveData("loggedInUser", foundUser);
    return true;
  }

  function signup(name, username, password) {
    const usernameTaken = users.find((item) => item.username === username);
    if (usernameTaken) return false;

    const newUser = {
      id: Date.now(),
      name,
      username,
      password,
      role: "user",
      points: 0,
      taskDailyRewardDates: [],
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    saveData("loggedInUser", newUser);
    return true;
  }

  function logout() {
    setUser(null);
    saveData("loggedInUser", null);
  }

  const value = {
    user,
    login,
    signup,
    logout,
    users,
    setUsers,
    tasks,
    setTasks,
    events,
    setEvents,
    hackathons,
    setHackathons,
    qna,
    setQna,
    notes,
    setNotes,
    feedback,
    setFeedback,
    addPoints,
    awardDailyTaskCoin,
    showToast,
    toasts,
    darkMode,
    setDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
