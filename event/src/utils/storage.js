// Simple helpers to save and load data from localStorage

export function getData(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeData(key) {
  localStorage.removeItem(key);
}

// Make a simple unique id
export function makeId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Seed starting data when user first opens the app
export function seedData() {
  if (getData("seeded")) return;

  saveData("users", [
    {
      id: 1,
      name: "Admin User",
      username: "admin",
      password: "admin123",
      role: "admin",
      points: 500,
      taskDailyRewardDates: [],
      pointsHistory: [
        {
          id: 1,
          points: 500,
          reason: "Initial seed balance",
          createdAt: "2026-04-01T08:00:00.000Z",
        },
      ],
    },
    {
      id: 2,
      name: "Alice",
      username: "alice",
      password: "alice123",
      role: "user",
      points: 120,
      taskDailyRewardDates: [],
      pointsHistory: [
        {
          id: 2,
          points: 40,
          reason: "Joined campus events",
          createdAt: "2026-04-05T09:30:00.000Z",
        },
        {
          id: 3,
          points: 80,
          reason: "Completed task streaks",
          createdAt: "2026-04-11T10:15:00.000Z",
        },
      ],
    },
    {
      id: 3,
      name: "Bob",
      username: "bob",
      password: "bob123",
      role: "user",
      points: 80,
      taskDailyRewardDates: [],
      pointsHistory: [
        {
          id: 4,
          points: 80,
          reason: "Hackathon participation",
          createdAt: "2026-04-09T07:45:00.000Z",
        },
      ],
    },
  ]);

  saveData("tasks", [
    {
      id: 1,
      userId: 2,
      title: "Complete Math Assignment",
      priority: "High",
      deadline: "2026-06-10",
      done: false,
      createdAt: "2026-04-12T09:00:00.000Z",
    },
    {
      id: 2,
      userId: 2,
      title: "Read Chapter 5 Physics",
      priority: "Medium",
      deadline: "2026-06-15",
      done: true,
      createdAt: "2026-04-12T10:00:00.000Z",
      completedAt: "2026-04-15T10:30:00.000Z",
    },
    {
      id: 3,
      userId: 2,
      title: "Submit History Essay",
      priority: "High",
      deadline: "2026-06-08",
      done: false,
      createdAt: "2026-04-13T11:00:00.000Z",
    },
  ]);

  saveData("events", [
    {
      id: 1,
      title: "Annual Science Fair",
      date: "2026-07-10",
      location: "Main Hall",
      venue: "Main Hall",
      desc: "Showcase your science projects.",
      description: "Showcase your science projects.",
      joined: [],
      registeredUsers: [],
      waitlistUsers: [],
      seatLimit: 60,
      registrationDeadline: "2026-07-05",
    },
    {
      id: 2,
      title: "AI/ML Workshop",
      date: "2026-06-28",
      location: "Lab 3",
      venue: "Lab 3",
      desc: "Learn machine learning basics.",
      description: "Learn machine learning basics.",
      joined: [],
      registeredUsers: [],
      waitlistUsers: [],
      seatLimit: 40,
      registrationDeadline: "2026-06-24",
    },
    {
      id: 3,
      title: "Cultural Fest",
      date: "2026-08-05",
      location: "Open Ground",
      venue: "Open Ground",
      desc: "Annual inter-department fest.",
      description: "Annual inter-department fest.",
      joined: [2],
      registeredUsers: [2],
      waitlistUsers: [],
      seatLimit: 150,
      registrationDeadline: "2026-08-01",
    },
  ]);

  saveData("hackathons", [
    {
      id: 1,
      title: "BuildFast 2026",
      desc: "Build a useful app in 24 hours.",
      date: "2026-07-20",
      prize: "Rs 10,000",
      teams: [],
    },
    {
      id: 2,
      title: "GreenCode Hack",
      desc: "Sustainable tech hackathon.",
      date: "2026-08-15",
      prize: "Rs 25,000",
      teams: [],
    },
  ]);

  saveData("qna", []);
  saveData("notes", []);
  saveData("polls", []);
  saveData("feedback", []);
  saveData("seeded", true);
}
