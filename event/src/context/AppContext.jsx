/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { getData, saveData, seedData } from "../utils/storage";

// App start hote hi initial demo data ready rahe, isliye yaha se seed kar diya.
seedData();

const AppContext = createContext();

function ensureUserDefaults(user) {
  if (!user) return user;

  // Set default values for missing fields
  let taskDates = [];
  if (Array.isArray(user.taskDailyRewardDates)) {
    taskDates = user.taskDailyRewardDates;
  }
  
  let history = [];
  if (Array.isArray(user.pointsHistory)) {
    history = user.pointsHistory;
  }

  return {
    ...user,
    points: user.points || 0,
    taskDailyRewardDates: taskDates,
    pointsHistory: history,
  };
}

function appendPointsHistory(user, points, reason) {
  const userWithDefaults = ensureUserDefaults(user);
  const currentPoints = user.points || 0;
  
  // Create new history entry
  const newEntry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    points: points,
    reason: reason,
    createdAt: new Date().toISOString(),
  };
  
  // Build new history array
  let newHistory = [];
  if (Array.isArray(userWithDefaults.pointsHistory)) {
    for (let i = 0; i < userWithDefaults.pointsHistory.length; i++) {
      newHistory.push(userWithDefaults.pointsHistory[i]);
    }
  }
  newHistory.push(newEntry);

  return {
    ...userWithDefaults,
    points: currentPoints + points,
    pointsHistory: newHistory,
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => ensureUserDefaults(getData("loggedInUser")) || null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    setToasts((current) => {
      const newToasts = [];
      for (let i = 0; i < current.length; i++) {
        newToasts.push(current[i]);
      }
      newToasts.push({ id: id, msg: msg, type: type });
      return newToasts;
    });

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToasts((current) => {
        const filtered = [];
        for (let i = 0; i < current.length; i++) {
          if (current[i].id !== id) {
            filtered.push(current[i]);
          }
        }
        return filtered;
      });
    }, 3000);
  }

  function syncUserUpdate(nextUsers, userId) {
    // Find the updated user
    let nextUser = null;
    for (let i = 0; i < nextUsers.length; i++) {
      if (nextUsers[i].id === userId) {
        nextUser = nextUsers[i];
        break;
      }
    }
    
    // Ensure all users have defaults
    const ensuredUsers = [];
    for (let i = 0; i < nextUsers.length; i++) {
      ensuredUsers.push(ensureUserDefaults(nextUsers[i]));
    }
    
    setUsers(ensuredUsers);
    if (user && user.id === userId) {
      setUser(nextUser ? ensureUserDefaults(nextUser) : null);
    }
    return nextUser;
  }

  function addPoints(points, reason = "Activity reward") {
    if (!user) return;

    // Update all users
    const nextUsers = [];
    for (let i = 0; i < users.length; i++) {
      const item = users[i];
      if (item.id === user.id) {
        nextUsers.push(appendPointsHistory(item, points, reason));
      } else {
        nextUsers.push(ensureUserDefaults(item));
      }
    }

    syncUserUpdate(nextUsers, user.id);
  }

  function awardDailyTaskCoin(dateKey) {
    if (!user) return false;

    const key = dateKey || new Date().toISOString().slice(0, 10);
    let awarded = false;

    // Update all users for daily task coin award
    const nextUsers = [];
    for (let i = 0; i < users.length; i++) {
      const item = users[i];
      if (item.id !== user.id) {
        nextUsers.push(ensureUserDefaults(item));
      } else {
        // Check if already awarded
        const rewardDates = Array.isArray(item.taskDailyRewardDates) ? item.taskDailyRewardDates : [];
        let alreadyAwarded = false;
        for (let j = 0; j < rewardDates.length; j++) {
          if (rewardDates[j] === key) {
            alreadyAwarded = true;
            break;
          }
        }
        
        if (!alreadyAwarded) {
          awarded = true;
          // Add date to reward dates and add points
          const newRewardDates = [];
          for (let j = 0; j < rewardDates.length; j++) {
            newRewardDates.push(rewardDates[j]);
          }
          newRewardDates.push(key);
          
          const updatedItem = appendPointsHistory(item, 2, "Daily task goal completed +2");
          updatedItem.taskDailyRewardDates = newRewardDates;
          nextUsers.push(updatedItem);
        } else {
          nextUsers.push(ensureUserDefaults(item));
        }
      }
    }

    if (awarded) {
      syncUserUpdate(nextUsers, user.id);
    }

    return awarded;
  }

  function login(username, password) {
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].password === password) {
        foundUser = users[i];
        break;
      }
    }

    if (!foundUser) return false;

    setUser(ensureUserDefaults(foundUser));
    return true;
  }

  function signup(name, username, password) {
    const usernameTaken = users.find((item) => item.username === username);
    if (usernameTaken) return false;

    // Signup ke time basic user object yahi se prepare ho raha hai.
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
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
