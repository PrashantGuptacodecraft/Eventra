# Eventra

Eventra is a frontend project I built to bring event management and task tracking into one simple portal. The idea was to create a single place where users can log in, manage their work, explore events, join hackathons, and stay engaged through notes, polls, and Q&A.

## Why I built it

I wanted to work on a project that combined productivity features with campus or community event management. Instead of keeping tasks, events, and user activity in separate places, Eventra brings them together in one dashboard-style experience.

## What the project includes

- Login and signup flow
- Personal task management
- Event listing and registration
- Hackathon browsing
- Notes, polls, and Q&A sections
- Points and rank tracking
- Event and task based reward system
- User profile management
- Admin panel for managing users, events, and hackathons
- Local storage support for saving app data in the browser

## Recent updates

- Rewards are now shown only for event and task activity.
- Coin-earned labels were removed from Notes and Q&A so non-reward sections do not show coins.
- Dashboard points breakdown now separates event rewards and task rewards more clearly.
- Dashboard rank card has a red highlight in dark mode for better visibility.

## Tech stack

- React
- Vite
- React Router
- Bootstrap
- Tailwind CSS
- LocalStorage

## Project structure

```text
event/
  src/
    components/
    context/
    pages/
    utils/
  public/
```

## Running the project

Make sure Node.js and npm are installed, then run:

```bash
cd event
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Demo login credentials

The app creates sample users in `localStorage` when it runs for the first time.

- Admin: `admin` / `admin123`
- User: `alice` / `alice123`
- User: `bob` / `bob123`

## Notes

- This project currently uses browser storage instead of a backend.
- The data is seeded automatically on first load.
- It is mainly built to demonstrate frontend structure, routing, state handling, and UI design.

## Future improvements

These are planned ideas for future versions. Right now the project is frontend-focused, so this roadmap is for showcase and planning only.

- Attendance Tracking
- Marks & Grading System
- CGPA Calculator
- Assignment Management
- Student Dashboard
- Class/Course Management
- Quiz & Assessment Tools
- Parent Portal
- Report Generation
- Notifications & Reminders
- Analytics for Educators
- Integration with Learning Tools
- User Authentication & Roles
- Real-Time Features
- Search & Filtering
- Event Reminders & Notifications
- Mobile Responsiveness
- Database & API Backend
- External Integrations
- Analytics & Reporting
- AI-Powered Suggestions
- Multi-Language Support
- Gamification
- Data Export/Import
- Timetable/Schedule Builder
- Resource Library
- Feedback & Surveys
- Gamification Elements
- Offline Mode
- Data Analytics Dashboard
- API Integrations
- Security & Compliance
- Mobile App Companion
- AI-Powered Insights
