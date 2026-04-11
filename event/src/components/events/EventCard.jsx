import React from "react";

function EventCard({ event, isRegistered, onMoreInfo }) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const status = isPast ? "Past" : "Upcoming";
  const statusClass = isPast
    ? "text-bg-secondary"
    : "text-bg-success";
  const category = event.category || "Hackathon";
  const registeredCount = event.registeredUsers?.length || 0;

  return (
    <article className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4 d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="h5 mb-0 fw-bold">{event.title}</h3>
          <span className={`badge ${statusClass}`}>{status}</span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <span className="badge rounded-pill text-bg-primary">{category}</span>
          {isRegistered && (
            <span className="badge rounded-pill text-bg-info">Registered</span>
          )}
        </div>

        <p className="text-secondary mb-0">
          {event.description?.slice(0, 95) || "No description available."}
          {(event.description?.length || 0) > 95 ? "..." : ""}
        </p>

        <div className="small text-secondary d-flex flex-column gap-1">
          <span>Date: {eventDate.toLocaleDateString()}</span>
          <span>Venue: {event.venue || "TBD"}</span>
          <span>Registered: {registeredCount}</span>
        </div>

        <div className="mt-auto pt-2">
          <button
            type="button"
            className="btn btn-outline-dark w-100 rounded-pill"
            onClick={() => onMoreInfo(event)}
          >
            More Info
          </button>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
