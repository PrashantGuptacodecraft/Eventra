/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { getData, saveData, seedData } from '../utils/storage'

// ── Seed demo data once ───────────────────────────
seedData()

// ── Create the context ────────────────────────────
const AppContext = createContext()

// ── Provider component ────────────────────────────
export function AppProvider({ children }) {

  // Auth state
  const [user,     setUser]     = useState(() => getData('loggedInUser') || null)
  const [darkMode, setDarkMode] = useState(false)

  // Data state - loaded from localStorage
  const [users,      setUsers]      = useState(() => getData('users')      || [])
  const [tasks,      setTasks]      = useState(() => getData('tasks')      || [])
  const [events,     setEvents]     = useState(() => getData('events')     || [])
  const [hackathons, setHackathons] = useState(() => getData('hackathons') || [])
  const [qna,        setQna]        = useState(() => getData('qna')        || [])
  const [notes,      setNotes]      = useState(() => getData('notes')      || [])
  const [feedback,   setFeedback]   = useState(() => getData('feedback')   || [])

  // Toast notifications
  const [toasts, setToasts] = useState([])

  // ── Auto-save to localStorage whenever data changes ──
  useEffect(() => { saveData('tasks',      tasks)      }, [tasks])
  useEffect(() => { saveData('events',     events)     }, [events])
  useEffect(() => { saveData('hackathons', hackathons) }, [hackathons])
  useEffect(() => { saveData('qna',        qna)        }, [qna])
  useEffect(() => { saveData('notes',      notes)      }, [notes])
  useEffect(() => { saveData('feedback',   feedback)   }, [feedback])
  useEffect(() => { saveData('users',      users)      }, [users])
  useEffect(() => {
    if (user) saveData('loggedInUser', user)
  }, [user])

  // ── Toast helper ─────────────────────────────────────
  function showToast(msg, type = 'info') {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // ── Give points to current user ──────────────────────
  function addPoints(pts) {
    if (!user) return
    const updated = users.map(u =>
      u.id === user.id ? { ...u, points: (u.points || 0) + pts } : u
    )
    setUsers(updated)
    const fresh = updated.find(u => u.id === user.id)
    setUser(fresh)
    saveData('loggedInUser', fresh)
  }

  // ── Login ─────────────────────────────────────────────
  function login(username, password) {
    const found = users.find(
      u => u.username === username && u.password === password
    )
    if (!found) return false
    setUser(found)
    saveData('loggedInUser', found)
    return true
  }

  // ── Signup ────────────────────────────────────────────
  function signup(name, username, password) {
    const exists = users.find(u => u.username === username)
    if (exists) return false
    const newUser = {
      id: Date.now(),
      name, username, password,
      role: 'user',
      points: 0,
    }
    const updated = [...users, newUser]
    setUsers(updated)
    setUser(newUser)
    saveData('loggedInUser', newUser)
    return true
  }

  // ── Logout ────────────────────────────────────────────
  function logout() {
    setUser(null)
    saveData('loggedInUser', null)
  }

  // ── Everything the app can access ─────────────────────
  const value = {
    // Auth
    user, login, signup, logout,

    // Data + setters
    users,      setUsers,
    tasks,      setTasks,
    events,     setEvents,
    hackathons, setHackathons,
    qna,        setQna,
    notes,      setNotes,
    feedback,   setFeedback,

    // Helpers
    addPoints,
    showToast,
    toasts,

    // Theme
    darkMode, setDarkMode,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// ── Custom hook so any component can use context easily ──
export function useApp() {
  return useContext(AppContext)
}

