import React from "react";

function EventCard({ event, isRegistered, isWaitlisted, onMoreInfo }) {
  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;
  const status = isPast ? "Past" : "Upcoming";
  
  // Determine status styling
  let statusClass = "text-bg-success";
  if (isPast) {
    statusClass = "text-bg-secondary";
  }
  
  const category = event.category || "Hackathon";
  const registeredCount = event.registeredUsers?.length || 0;
  const waitlistCount = event.waitlistUsers?.length || 0;
  
  // Calculate seats left
  const seatLimit = event.seatLimit || 0;
  const seatsLeft = seatLimit - registeredCount;
  let seatsLeftDisplay = seatsLeft;
  if (seatsLeft < 0) {
    seatsLeftDisplay = 0;
  }
  
  // Get description
  const description = event.description || "No description available.";
  let shortDesc = description.slice(0, 95);
  let showDots = description.length > 95;

  return (
    <article
      className={`event-card card border-0 shadow-sm rounded-4 h-100 ${
        isRegistered ? "bg-success-subtle" : ""
      }`}
    >
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
          {isWaitlisted && (
            <span className="badge rounded-pill text-bg-warning">Waitlisted</span>
          )}
        </div>

        <p className="event-card-copy text-secondary mb-0">
          {shortDesc}
          {showDots && "..."}
        </p>

        <div className="event-card-meta small text-secondary d-flex flex-column gap-1">
          <span>Date: {eventDate.toLocaleDateString()}</span>
          <span>Venue: {event.venue || "TBD"}</span>
          <span>Registered: {registeredCount} / {event.seatLimit}</span>
          <span>Seats Left: {seatsLeftDisplay}</span>
          <span>Waitlist: {waitlistCount}</span>
        </div>

        <div className="mt-auto pt-2">
          <button
            type="button"
            className="event-card-action btn btn-outline-dark w-100 rounded-pill"
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
