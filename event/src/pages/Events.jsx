import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Events = () => {
  const { user, events, setEvents, addPoints, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.desc.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "joined" && event.joined.includes(user.id)) ||
      (filter === "upcoming" && new Date(event.date) > new Date()) ||
      (filter === "past" && new Date(event.date) < new Date());
    return matchesSearch && matchesFilter;
  });

  const handleJoin = (eventId) => {
    const updated = events.map((event) =>
      event.id === eventId
        ? { ...event, joined: [...event.joined, user.id] }
        : event,
    );
    setEvents(updated);
    showToast("Joined event", "success");
    addPoints(5); // Points for joining event
  };

  const handleLeave = (eventId) => {
    const updated = events.map((event) =>
      event.id === eventId
        ? { ...event, joined: event.joined.filter((id) => id !== user.id) }
        : event,
    );
    setEvents(updated);
    showToast("Left event", "info");
  };

  const isJoined = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event?.joined.includes(user.id);
  };

  const getStatus = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    if (eventDate < now) return "Past";
    if (eventDate.toDateString() === now.toDateString()) return "Today";
    return "Upcoming";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Past":
        return "bg-gray-100 text-gray-800";
      case "Today":
        return "bg-blue-100 text-blue-800";
      case "Upcoming":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Events</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="🔍 Search events..."
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 rounded ${filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("joined")}
          className={`px-4 py-2 rounded ${filter === "joined" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Joined
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`px-4 py-2 rounded ${filter === "past" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Past
        </button>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {event.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getStatus(event.date))}`}
              >
                {getStatus(event.date)}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{event.desc}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>📍 {event.location}</span>
              <span>👥 {event.joined.length} registered</span>
            </div>

            <div className="flex justify-end">
              {user.role !== "admin" && (
                <>
                  {isJoined(event.id) ? (
                    <button
                      onClick={() => handleLeave(event.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Leave Event
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(event.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Join Event
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <p className="text-center text-gray-500 py-8">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
