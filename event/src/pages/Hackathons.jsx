import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Hackathons = () => {
  const { user, hackathons, setHackathons, addPoints, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredHackathons = hackathons.filter((hack) => {
    const matchesSearch =
      hack.title.toLowerCase().includes(search.toLowerCase()) ||
      hack.desc.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "joined" && hack.teams.includes(user.id)) ||
      (filter === "upcoming" && new Date(hack.date) > new Date()) ||
      (filter === "past" && new Date(hack.date) < new Date());
    return matchesSearch && matchesFilter;
  });

  const handleJoin = (hackId) => {
    const updated = hackathons.map((hack) =>
      hack.id === hackId ? { ...hack, teams: [...hack.teams, user.id] } : hack,
    );
    setHackathons(updated);
    showToast("Joined hackathon", "success");
    addPoints(10); // Points for joining hackathon
  };

  const handleLeave = (hackId) => {
    const updated = hackathons.map((hack) =>
      hack.id === hackId
        ? { ...hack, teams: hack.teams.filter((id) => id !== user.id) }
        : hack,
    );
    setHackathons(updated);
    showToast("Left hackathon", "info");
  };

  const isJoined = (hackId) => {
    const hack = hackathons.find((h) => h.id === hackId);
    return hack?.teams.includes(user.id);
  };

  const getStatus = (date) => {
    const hackDate = new Date(date);
    const now = new Date();
    if (hackDate < now) return "Past";
    if (hackDate.toDateString() === now.toDateString()) return "Today";
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hackathons</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="🔍 Search hackathons..."
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

      {/* Hackathons List */}
      <div className="grid gap-4">
        {filteredHackathons.map((hack) => (
          <div
            key={hack.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {hack.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getStatus(hack.date))}`}
              >
                {getStatus(hack.date)}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{hack.desc}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>📅 {new Date(hack.date).toLocaleDateString()}</span>
              <span>🏆 Prize: {hack.prize}</span>
              <span>👥 {hack.teams.length} participants</span>
            </div>

            <div className="flex justify-end">
              {user.role !== "admin" && (
                <>
                  {isJoined(hack.id) ? (
                    <button
                      onClick={() => handleLeave(hack.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Leave Hackathon
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(hack.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Join Hackathon
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {filteredHackathons.length === 0 && (
          <p className="text-center text-gray-500 py-8">No hackathons found.</p>
        )}
      </div>
    </div>
  );
};

export default Hackathons;
