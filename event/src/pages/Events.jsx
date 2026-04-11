import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import EventCard from "../components/events/EventCard";
import EventModal from "../components/events/EventModal";

const fallbackEvents = [
  {
    id: 101,
    title: "BuildSprint Campus Hack",
    category: "Hackathon",
    date: "2026-06-12",
    venue: "Innovation Lab",
    description: "24-hour team hackathon to build campus-impact products.",
    rules: "Teams of 2-4. Original work only. Final demo mandatory.",
    registeredUsers: [],
  },
  {
    id: 102,
    title: "Spring Cultural Fest",
    category: "Fest",
    date: "2026-05-20",
    venue: "Open Amphitheatre",
    description: "Music, dance, and drama performances across departments.",
    rules: "Entry with student ID. Follow venue timing and stage rules.",
    registeredUsers: [],
  },
  {
    id: 104,
    title: "Battle of the Bands",
    category: "Fest",
    date: "2026-08-10",
    venue: "Campus Auditorium",
    description: "Annual music competition where college bands face off.",
    rules: "15 minutes per band. Bring your own instruments. Pre-registration required.",
    registeredUsers: [],
  },
  {
    id: 103,
    title: "Inter-College Basketball",
    category: "Fest",
    date: "2026-07-15",
    venue: "Main Indoor Stadium",
    description: "Annual inter-college basketball tournament.",
    rules: "Teams of 5. Standard rules apply.",
    registeredUsers: [],
  },
  {
    id: 105,
    title: "Athletics Meet 2026",
    category: "Fest",
    date: "2026-09-05",
    venue: "University Sports Track",
    description: "Track and field events including sprints, relays, and long jump.",
    rules: "Proper sports attire mandatory. Maximum 3 events per student.",
    registeredUsers: [],
  },
];

function normalizeEvent(event) {
  const registeredUsers = Array.isArray(event.registeredUsers)
    ? event.registeredUsers
    : Array.isArray(event.joined)
      ? event.joined
      : [];

  let cat = event.category;
  if (!cat) {
    const text = ((event.title || "") + " " + (event.description || event.desc || "")).toLowerCase();
    if (text.includes("fest") || text.includes("cultural") || text.includes("music") || text.includes("dance")) {
      cat = "Fest";
    } else {
      cat = "Hackathon";
    }
  }

  return {
    id: event.id,
    title: event.title,
    category: cat,
    date: event.date,
    venue: event.venue || event.location || "TBD",
    description: event.description || event.desc || "No description available.",
    rules: event.rules || "Follow event guidelines and be respectful.",
    registeredUsers,
  };
}

const EventsPage = () => {
  const { user, events, setEvents, showToast, addPoints } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("All");
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "Hackathon",
    date: "",
    venue: "",
    description: "",
    rules: "",
  });

  const allEvents = useMemo(() => {
    // Merge fallback events with actual state events so cards are always shown
    const stateEvents = Array.isArray(events) ? events : [];
    
    // Use fallback events as the base, then overlay state events
    const combined = [...fallbackEvents];
    stateEvents.forEach(se => {
      if (!combined.find(ce => ce.id === se.id)) {
        combined.push(se);
      }
    });

    return combined.map(normalizeEvent);
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (filter === "All") return allEvents;
    return allEvents.filter((event) => event.category === filter);
  }, [allEvents, filter]);

  const isRegistered = (event) => {
    if (!event || !user) {
      return false;
    }
    return event.registeredUsers.includes(user.id);
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();

    const title = newEvent.title.trim();
    const venue = newEvent.venue.trim();
    const description = newEvent.description.trim();
    const rules = newEvent.rules.trim();

    if (!title || !newEvent.date || !venue || !description) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const created = {
      id: Date.now(),
      title,
      category: newEvent.category,
      date: newEvent.date,
      venue,
      location: venue,
      description,
      desc: description,
      rules: rules || "Follow event guidelines and be respectful.",
      registeredUsers: [],
      joined: [],
    };

    setEvents([created, ...(Array.isArray(events) ? events : [])]);
    setNewEvent({
      title: "",
      category: "Hackathon",
      date: "",
      venue: "",
      description: "",
      rules: "",
    });
    showToast("Event created", "success");
  };

  const handleRegister = (eventToRegister) => {
    const targetEvent = eventToRegister || selectedEvent;
    if (!targetEvent || !user) {
      if (!user) showToast("Please login to register", "error");
      return;
    }

    if (targetEvent.registeredUsers.includes(user.id)) {
      showToast("Already Registered", "info");
      return;
    }

    const updated = allEvents.map((event) => {
      if (event.id !== targetEvent.id) {
        return event;
      }

      const nextRegisteredUsers = [...event.registeredUsers, user.id];

      return {
        ...event,
        registeredUsers: nextRegisteredUsers,
      };
    });

    // Keep backward compatibility with existing `joined` shape too.
    setEvents(
      updated.map((event) => ({
        ...event,
        joined: event.registeredUsers,
        location: event.venue,
        desc: event.description,
      })),
    );

    if (selectedEvent && selectedEvent.id === targetEvent.id) {
      const freshSelected = updated.find((event) => event.id === targetEvent.id) || null;
      setSelectedEvent(freshSelected);
    }
    addPoints(10);
    showToast("Registered successfully", "success");
  };

  return (
    <section className="p-4 p-md-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="h3 fw-bold mb-0">Events</h1>
        <span className="badge text-bg-light border">{filteredEvents.length} Events</span>
      </div>

      <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
        {["All", "Hackathon", "Fest"].map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${filter === cat ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {user?.role === "admin" && (
        <form
          onSubmit={handleCreateEvent}
          className="bg-white border border-gray-200 rounded-4 p-4 shadow-sm mb-4"
        >
          <h2 className="h5 fw-semibold mb-3">Create Event (Admin)</h2>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={newEvent.category}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Fest">Fest</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Venue"
                value={newEvent.venue}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, venue: e.target.value }))
                }
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Rules (optional)"
                value={newEvent.rules}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, rules: e.target.value }))
                }
              />
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Create Event
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="row g-4">
        {filteredEvents.map((event) => (
          <div className="col-12 col-md-6 col-xl-4" key={event.id}>
            <EventCard
              event={event}
              isRegistered={isRegistered(event)}
              onMoreInfo={setSelectedEvent}
            />
          </div>
        ))}
      </div>

      <EventModal
        event={selectedEvent}
        isRegistered={isRegistered(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        onRegister={() => handleRegister(selectedEvent)}
      />
    </section>
  );
};

export default EventsPage;
