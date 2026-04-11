import React from "react";

function EventModal({
  event,
  isRegistered,
  onClose,
  onRegister,
}) {
  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const registeredCount = event.registeredUsers?.length || 0;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(15, 23, 42, 0.55)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{ width: "min(92vw, 680px)", maxHeight: "85vh", overflowY: "auto" }}
        onClick={(eventClick) => eventClick.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
          <div>
            <h4 className="fw-bold mb-1">{event.title}</h4>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge rounded-pill text-bg-primary">
                {event.category || "Hackathon"}
              </span>
              <span className={`badge rounded-pill ${isPast ? "text-bg-secondary" : "text-bg-success"}`}>
                {isPast ? "Past" : "Upcoming"}
              </span>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <h6 className="mb-1">Description</h6>
          <p className="text-secondary mb-0">
            {event.description || "No description available."}
          </p>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="mb-1">Date</h6>
              <p className="mb-0 text-secondary">{eventDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="mb-1">Venue</h6>
              <p className="mb-0 text-secondary">{event.venue || "TBD"}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="mb-1">Rules</h6>
          <p className="text-secondary mb-0">{event.rules || "Follow event guidelines and be respectful."}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="text-secondary small">
            Registered Users: {registeredCount}
          </span>
          <button
            type="button"
            className={`btn rounded-pill px-4 ${isRegistered ? "btn-outline-secondary" : "btn-primary"}`}
            onClick={onRegister}
            disabled={isRegistered}
          >
            {isRegistered ? "Already Registered" : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
