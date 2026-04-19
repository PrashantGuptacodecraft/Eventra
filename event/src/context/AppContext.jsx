/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getData, saveData, seedData } from "../utils/storage";

seedData();

const AppContext = createContext();

function ensureUserDefaults(user) {
  if (!user) return user;

  return {
    ...user,
    points: user.points || 0,
    taskDailyRewardDates: Array.isArray(user.taskDailyRewardDates)
      ? user.taskDailyRewardDates
      : [],
    pointsHistory: Array.isArray(user.pointsHistory) ? user.pointsHistory : [],
  };
}

function appendPointsHistory(user, points, reason) {
  return {
    ...ensureUserDefaults(user),
    points: (user.points || 0) + points,
    pointsHistory: [
      ...(Array.isArray(user.pointsHistory) ? user.pointsHistory : []),
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        points,
        reason,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => ensureUserDefaults(getData("loggedInUser")) || null);
  const [darkMode, setDarkMode] = useState(false);

  const [users, setUsers] = useState(() =>
    (getData("users") || []).map(ensureUserDefaults),
  );
  const [tasks, setTasks] = useState(() => getData("tasks") || []);
  const [events, setEvents] = useState(() => getData("events") || []);
  const [qna, setQna] = useState(() => getData("qna") || []);
  const [notes, setNotes] = useState(() => getData("notes") || []);
  const [polls, setPolls] = useState(() => getData("polls") || []);
  const [feedback, setFeedback] = useState(() => getData("feedback") || []);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    saveData("tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    saveData("events", events);
  }, [events]);

  useEffect(() => {
    saveData("qna", qna);
  }, [qna]);

  useEffect(() => {
    saveData("notes", notes);
  }, [notes]);

  useEffect(() => {
    saveData("polls", polls);
  }, [polls]);

  useEffect(() => {
    saveData("feedback", feedback);
  }, [feedback]);

  useEffect(() => {
    saveData("users", users.map(ensureUserDefaults));
  }, [users]);

  useEffect(() => {
    saveData("loggedInUser", user ? ensureUserDefaults(user) : null);
  }, [user]);

  function showToast(msg, type = "info") {
    const id = Date.now();
    setToasts((current) => [...current, { id, msg, type }]);

    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }

  function syncUserUpdate(nextUsers, userId) {
    const nextUser = nextUsers.find((item) => item.id === userId) || null;
    setUsers(nextUsers.map(ensureUserDefaults));
    if (user?.id === userId) {
      setUser(nextUser ? ensureUserDefaults(nextUser) : null);
    }
    return nextUser;
  }

  function addPoints(points, reason = "Activity reward") {
    if (!user) return;

    const nextUsers = users.map((item) =>
      item.id === user.id ? appendPointsHistory(item, points, reason) : ensureUserDefaults(item),
    );

    syncUserUpdate(nextUsers, user.id);
  }

  function awardDailyTaskCoin(dateKey) {
    if (!user) return false;

    const key = dateKey || new Date().toISOString().slice(0, 10);
    let awarded = false;

    const nextUsers = users.map((item) => {
      if (item.id !== user.id) return ensureUserDefaults(item);

      const rewardDates = Array.isArray(item.taskDailyRewardDates)
        ? item.taskDailyRewardDates
        : [];

      if (rewardDates.includes(key)) return ensureUserDefaults(item);

      awarded = true;
      return {
        ...appendPointsHistory(item, 2, "Completed daily 15-task goal"),
        taskDailyRewardDates: [...rewardDates, key],
      };
    });

    if (!awarded) return false;

    syncUserUpdate(nextUsers, user.id);
    return true;
  }

  function login(username, password) {
    const foundUser = users.find(
      (item) => item.username === username && item.password === password,
    );

    if (!foundUser) return false;

    setUser(ensureUserDefaults(foundUser));
    return true;
  }

  function signup(name, username, password) {
    const usernameTaken = users.find((item) => item.username === username);
    if (usernameTaken) return false;

    const newUser = ensureUserDefaults({
      id: Date.now(),
      name,
      username,
      password,
      role: "user",
      points: 0,
      taskDailyRewardDates: [],
      pointsHistory: [],
    });

    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  }

  function logout() {
    setUser(null);
    saveData("loggedInUser", null);
  }

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
    users,
    setUsers,
    tasks,
    setTasks,
    events,
    setEvents,
    qna,
    setQna,
    notes,
    setNotes,
    polls,
    setPolls,
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
