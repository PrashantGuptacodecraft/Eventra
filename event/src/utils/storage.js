// Simple helpers to save and load data from localStorage

export function getData(key) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeData(key) {
  localStorage.removeItem(key)
}

// Make a simple unique id
export function makeId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Seed starting data when user first opens the app
export function seedData() {
  if (getData('seeded')) return

  saveData('users', [
    { id: 1, name: 'Admin User',  username: 'admin', password: 'admin123', role: 'admin', points: 500 },
    { id: 2, name: 'Alice',       username: 'alice', password: 'alice123', role: 'user',  points: 120 },
    { id: 3, name: 'Bob',         username: 'bob',   password: 'bob123',   role: 'user',  points: 80  },
  ])

  saveData('tasks', [
    { id: 1, userId: 2, title: 'Complete Math Assignment', priority: 'High',   deadline: '2025-06-10', done: false },
    { id: 2, userId: 2, title: 'Read Chapter 5 Physics',   priority: 'Medium', deadline: '2025-06-15', done: true  },
    { id: 3, userId: 2, title: 'Submit History Essay',      priority: 'High',   deadline: '2025-06-08', done: false },
  ])

  saveData('events', [
    { id: 1, title: 'Annual Science Fair', date: '2025-07-10', location: 'Main Hall',   desc: 'Showcase your science projects.', joined: [] },
    { id: 2, title: 'AI/ML Workshop',      date: '2025-06-28', location: 'Lab 3',       desc: 'Learn machine learning basics.',   joined: [] },
    { id: 3, title: 'Cultural Fest',        date: '2025-08-05', location: 'Open Ground', desc: 'Annual inter-department fest.',    joined: [2] },
  ])

  saveData('hackathons', [
    { id: 1, title: 'BuildFast 2025',  desc: 'Build a useful app in 24 hours.', date: '2025-07-20', prize: '₹10,000', teams: [] },
    { id: 2, title: 'GreenCode Hack',  desc: 'Sustainable tech hackathon.',      date: '2025-08-15', prize: '₹25,000', teams: [] },
  ])

  saveData('qna',      [])
  saveData('notes',    [])
  saveData('feedback', [])
  saveData('seeded',   true)
}
