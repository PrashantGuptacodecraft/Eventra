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
    waitlistUsers: [],
    seatLimit: 40,
    registrationDeadline: "2026-06-08",
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
    waitlistUsers: [],
    seatLimit: 120,
    registrationDeadline: "2026-05-16",
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
    waitlistUsers: [],
    seatLimit: 30,
    registrationDeadline: "2026-08-05",
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
    waitlistUsers: [],
    seatLimit: 50,
    registrationDeadline: "2026-07-10",
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
    waitlistUsers: [],
    seatLimit: 80,
    registrationDeadline: "2026-09-01",
  },
];

function normalizeEvent(event) {
  const registeredUsers = Array.isArray(event.registeredUsers)
    ? event.registeredUsers
    : Array.isArray(event.joined)
      ? event.joined
      : [];
  const waitlistUsers = Array.isArray(event.waitlistUsers)
    ? event.waitlistUsers
    : [];

  let category = event.category;
  if (!category) {
    const text = ((event.title || "") + " " + (event.description || event.desc || "")).toLowerCase();
    if (text.includes("fest") || text.includes("cultural") || text.includes("music") || text.includes("dance")) {
      category = "Fest";
    } else {
      category = "Hackathon";
    }
  }

  return {
    id: event.id,
    title: event.title,
    category,
    date: event.date,
    venue: event.venue || event.location || "TBD",
    description: event.description || event.desc || "No description available.",
    rules: event.rules || "Follow event guidelines and be respectful.",
    registeredUsers,
    waitlistUsers,
    seatLimit: Number(event.seatLimit) > 0 ? Number(event.seatLimit) : 50,
    registrationDeadline: event.registrationDeadline || event.date,
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
    seatLimit: "50",
    registrationDeadline: "",
  });

  const allEvents = useMemo(() => {
    const stateEvents = Array.isArray(events) ? events : [];

    const eventMap = new Map();

    fallbackEvents.forEach((event) => {
      eventMap.set(event.id, event);
    });

    stateEvents.forEach((event) => {
      eventMap.set(event.id, {
        ...eventMap.get(event.id),
        ...event,
      });
    });

    return Array.from(eventMap.values()).map(normalizeEvent);
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

  const isWaitlisted = (event) => {
    if (!event || !user) return false;
    return event.waitlistUsers?.includes(user.id);
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();

    const title = newEvent.title.trim();
    const venue = newEvent.venue.trim();
    const description = newEvent.description.trim();
    const rules = newEvent.rules.trim();
    const seatLimit = Number(newEvent.seatLimit);

    if (!title || !newEvent.date || !venue || !description) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!seatLimit || seatLimit < 1) {
      showToast("Seat limit should be at least 1", "error");
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
      waitlistUsers: [],
      joined: [],
      seatLimit,
      registrationDeadline: newEvent.registrationDeadline || newEvent.date,
    };

    setEvents([created, ...(Array.isArray(events) ? events : [])]);
    setNewEvent({
      title: "",
      category: "Hackathon",
      date: "",
      venue: "",
      description: "",
      rules: "",
      seatLimit: "50",
      registrationDeadline: "",
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

    if (targetEvent.waitlistUsers?.includes(user.id)) {
      showToast("You are already on the waitlist", "info");
      return;
    }

    if (new Date(targetEvent.registrationDeadline) < new Date()) {
      showToast("Registration deadline has passed", "error");
      return;
    }

    const updated = allEvents.map((event) => {
      if (event.id !== targetEvent.id) {
        return event;
      }

      const hasSeats = event.registeredUsers.length < event.seatLimit;
      const nextRegisteredUsers = hasSeats
        ? [...event.registeredUsers, user.id]
        : event.registeredUsers;
      const nextWaitlistUsers = hasSeats
        ? event.waitlistUsers
        : [...event.waitlistUsers, user.id];

      return {
        ...event,
        registeredUsers: nextRegisteredUsers,
        waitlistUsers: nextWaitlistUsers,
      };
    });

    // Keep backward compatibility with existing `joined` shape too.
    setEvents(
      updated.map((event) => ({
        ...event,
        joined: event.registeredUsers,
        location: event.venue,
        desc: event.description,
        seatLimit: event.seatLimit,
        registrationDeadline: event.registrationDeadline,
      })),
    );

    if (selectedEvent && selectedEvent.id === targetEvent.id) {
      const freshSelected = updated.find((event) => event.id === targetEvent.id) || null;
      setSelectedEvent(freshSelected);
    }
    const wasRegistered = updated.find((event) => event.id === targetEvent.id);
    if (wasRegistered?.registeredUsers.includes(user.id)) {
      addPoints(10, `Registered for ${targetEvent.title}`);
      showToast("Registered successfully", "success");
    } else {
      showToast("Event is full. Added to waitlist", "info");
    }
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
            <div className="col-md-3">
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="Seat Limit"
                value={newEvent.seatLimit}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, seatLimit: e.target.value }))
                }
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={newEvent.registrationDeadline}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    registrationDeadline: e.target.value,
                  }))
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
              isWaitlisted={isWaitlisted(event)}
              onMoreInfo={setSelectedEvent}
            />
          </div>
        ))}
      </div>

      <EventModal
        event={selectedEvent}
        isRegistered={isRegistered(selectedEvent)}
        isWaitlisted={isWaitlisted(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        onRegister={() => handleRegister(selectedEvent)}
      />
    </section>
  );
};

export default EventsPage;
