<p align="center">
  <img
    src="./public/eventra-logo1.jpeg"
    alt="Eventra logo"
    width="260"
    style="border-radius: 50%; object-fit: cover;"
  />
</p>

<h1 align="center">Eventra</h1>

<p align="center">
  <strong>Plan. Connect. Enjoy.</strong>
</p>

<p align="center">
  A unified event and task management portal built with React and Vite for organizing tasks,
  events, hackathons, notes, polls, and team engagement in one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Bootstrap-5-6f42c1?style=for-the-badge&logo=bootstrap" alt="Bootstrap 5" />
  <img src="https://img.shields.io/badge/Router-React%20Router-ca4245?style=for-the-badge&logo=reactrouter" alt="React Router" />
</p>

---

## Overview

The app is designed as a student or campus productivity portal where users can:

- manage personal tasks
- explore and join events
- view hackathons
- create notes
- participate in Q&A and polls
- track points and leaderboard progress

An admin user can also manage users, events, hackathons, and view platform statistics.

## Highlights

- Authentication with login and signup flow
- Dashboard with task progress, recent tasks, upcoming events, and leaderboard
- Task management with completion tracking
- Event listing and participation
- Hackathon browsing
- Notes, Q&A, poll, and profile sections
- Admin panel for user, event, and hackathon management
- Local storage persistence for app data
- Light and dark theme support

## Preview

Eventra combines productivity and engagement tools into one dashboard-driven experience:

- personal task tracking with progress visibility
- event discovery and participation
- hackathon exploration and management
- notes, polls, and Q&A collaboration
- leaderboard-based user engagement
- admin controls for platform oversight

## Tech Stack

- React 19
- Vite
- React Router DOM
- Bootstrap 5
- Tailwind CSS utilities
- LocalStorage for frontend data persistence

## Project Structure

```text
event/
  src/
    components/
    context/
    pages/
    utils/
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
cd event
npm install
```

### Run the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

The app seeds sample users into `localStorage` on first load:

- Admin: `admin` / `admin123`
- User: `alice` / `alice123`
- User: `bob` / `bob123`

## Data Handling

This project currently uses browser `localStorage` instead of a backend. Seed data is created automatically when the app runs for the first time.

## Future Improvements

- Connect the app to a real backend and database
- Add role-based API authorization
- Improve form validation
- Add notifications and reminders
- Add tests for core flows

## Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint
