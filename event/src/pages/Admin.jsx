import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";

const Admin = () => {
  const {
    user,
    users,
    setUsers,
    events,
    setEvents,
    hackathons,
    setHackathons,
    tasks,
    notes,
    qna,
    showToast,
  } = useApp();
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateHackathon, setShowCreateHackathon] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    desc: "",
    date: "",
    location: "",
  });
  const [hackathonForm, setHackathonForm] = useState({
    title: "",
    desc: "",
    date: "",
    prize: "",
  });
  const eventDateRef = useRef(null);
  const hackathonDateRef = useRef(null);

  if (user.role !== "admin") {
    return (
      <div className="container-fluid px-3 px-md-4 py-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You need admin privileges to view this page.</p>
      </div>
    );
  }

  const deleteUser = (userId) => {
    if (window.confirm("Delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId));
      showToast("User deleted", "success");
    }
  };

  const deleteEvent = (eventId) => {
    if (window.confirm("Delete this event?")) {
      setEvents(events.filter((e) => e.id !== eventId));
      showToast("Event deleted", "success");
    }
  };

  const deleteHackathon = (hackId) => {
    if (window.confirm("Delete this hackathon?")) {
      setHackathons(hackathons.filter((h) => h.id !== hackId));
      showToast("Hackathon deleted", "success");
    }
  };

  const handleEventChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleHackathonChange = (e) => {
    setHackathonForm({
      ...hackathonForm,
      [e.target.name]: e.target.value,
    });
  };

  const createEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...eventForm,
      joined: [],
    };
    setEvents([...events, newEvent]);
    showToast("Event created", "success");
    setEventForm({ title: "", desc: "", date: "", location: "" });
    setShowCreateEvent(false);
  };

  const createHackathon = (e) => {
    e.preventDefault();
    const newHackathon = {
      id: Date.now(),
      ...hackathonForm,
      teams: [],
    };
    setHackathons([...hackathons, newHackathon]);
    showToast("Hackathon created", "success");
    setHackathonForm({ title: "", desc: "", date: "", prize: "" });
    setShowCreateHackathon(false);
  };

  return (
    <div className="container-fluid px-3 px-md-4 px-xl-5 py-4 py-md-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 mb-md-5">Admin Panel</h1>

      <div className="mb-4 mb-md-5">
        <nav className="d-flex gap-2 gap-md-3 flex-wrap">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded ${activeTab === "events" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("hackathons")}
            className={`px-4 py-2 rounded ${activeTab === "hackathons" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Hackathons ({hackathons.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded ${activeTab === "stats" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Statistics
          </button>
        </nav>
      </div>

      {activeTab === "users" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Username</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-left py-2">Points</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2">{u.username}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                    <td className="py-2">{u.points || 0}</td>
                    <td className="py-2">
                      {u.id !== user.id && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h2 className="text-xl font-semibold">Event Management</h2>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Event
            </button>
          </div>

          {showCreateEvent && (
            <form
              onSubmit={createEvent}
              className="mb-6 p-4 bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventForm.title}
                    onChange={handleEventChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      ref={eventDateRef}
                      type="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleEventChange}
                      required
                      className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        eventDateRef.current?.showPicker?.() ||
                        eventDateRef.current?.click()
                      }
                    >
                      📅
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    value={eventForm.desc}
                    onChange={handleEventChange}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4 flex-wrap">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateEvent(false);
                    setEventForm({
                      title: "",
                      desc: "",
                      date: "",
                      location: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded p-4"
              >
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.desc}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Location: {event.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined: {event.joined.length}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "hackathons" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h2 className="text-xl font-semibold">Hackathon Management</h2>
            <button
              onClick={() => setShowCreateHackathon(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Hackathon
            </button>
          </div>

          {showCreateHackathon && (
            <form
              onSubmit={createHackathon}
              className="mb-6 p-4 bg-gray-50 rounded"
            >
              <h3 className="text-lg font-semibold mb-4">
                Create New Hackathon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={hackathonForm.title}
                    onChange={handleHackathonChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      ref={hackathonDateRef}
                      type="date"
                      name="date"
                      value={hackathonForm.date}
                      onChange={handleHackathonChange}
                      required
                      className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <span
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        hackathonDateRef.current?.showPicker?.() ||
                        hackathonDateRef.current?.click()
                      }
                    >
                      📅
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prize
                  </label>
                  <input
                    type="text"
                    name="prize"
                    value={hackathonForm.prize}
                    onChange={handleHackathonChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    value={hackathonForm.desc}
                    onChange={handleHackathonChange}
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4 flex-wrap">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Hackathon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateHackathon(false);
                    setHackathonForm({
                      title: "",
                      desc: "",
                      date: "",
                      prize: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {hackathons.map((hack) => (
              <div key={hack.id} className="border border-gray-200 rounded p-4">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                  <div>
                    <h3 className="font-semibold">{hack.title}</h3>
                    <p className="text-sm text-gray-600">{hack.desc}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(hack.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Prize: {hack.prize}</p>
                    <p className="text-sm text-gray-500">
                      Participants: {hack.teams.length}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteHackathon(hack.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {users.length}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">
                {events.length}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {hackathons.length}
              </div>
              <div className="text-sm text-gray-600">Total Hackathons</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded">
              <div className="text-2xl font-bold text-indigo-600">
                {notes.length}
              </div>
              <div className="text-sm text-gray-600">Total Notes</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded">
              <div className="text-2xl font-bold text-pink-600">
                {qna.length}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
