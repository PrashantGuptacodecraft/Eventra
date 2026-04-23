import React, { useState } from "react";

function EventModal({
  event,
  isRegistered,
  isWaitlisted,
  onClose,
  onRegister,
}) {
  const [showQr, setShowQr] = useState(false);

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;
  const registeredCount = event.registeredUsers?.length || 0;
  const waitlistCount = event.waitlistUsers?.length || 0;
  
  // Calculate seats left
  const seatLimit = event.seatLimit || 0;
  let seatsLeft = seatLimit - registeredCount;
  if (seatsLeft < 0) {
    seatsLeft = 0;
  }
  
  // Get registration deadline
  let deadline = eventDate;
  if (event.registrationDeadline) {
    deadline = new Date(event.registrationDeadline);
  }
  const deadlinePassed = deadline < now;
  const qrImageUrl = "/qr-pass.svg";

  return (
    <div
      className="event-modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(15, 23, 42, 0.55)", zIndex: 1050 }}
      onClick={onClose}
    >
      <div
        className={`event-modal rounded-4 shadow-lg p-4 ${
          isRegistered ? "bg-success-subtle" : "bg-white"
        }`}
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
              {isWaitlisted ? (
                <span className="badge rounded-pill text-bg-warning">Waitlisted</span>
              ) : null}
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <h6 className="mb-1">Description</h6>
          <p className="event-modal-copy text-secondary mb-0">
            {event.description || "No description available."}
          </p>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <div className="event-modal-info border rounded-3 p-3 h-100">
              <h6 className="mb-1">Date</h6>
              <p className="mb-0 text-secondary">{eventDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="event-modal-info border rounded-3 p-3 h-100">
              <h6 className="mb-1">Venue</h6>
              <p className="mb-0 text-secondary">{event.venue || "TBD"}</p>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="event-modal-info border rounded-3 p-3 h-100">
              <h6 className="mb-1">Seat Limit</h6>
              <p className="mb-0 text-secondary">
                {registeredCount} / {event.seatLimit} filled
              </p>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="event-modal-info border rounded-3 p-3 h-100">
              <h6 className="mb-1">Registration Deadline</h6>
              <p className="mb-0 text-secondary">
                {deadline.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="mb-1">Rules</h6>
          <p className="event-modal-copy text-secondary mb-0">
            {event.rules || "Follow event guidelines and be respectful."}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="event-modal-meta text-secondary small">
            Registered: {registeredCount} | Seats left: {seatsLeft} | Waitlist: {waitlistCount}
          </span>
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            {isRegistered ? (
              <>
                <button
                  type="button"
                  className="event-modal-action btn btn-outline-dark rounded-pill px-4"
                  onClick={() => setShowQr((current) => !current)}
                >
                  {showQr ? "Hide QR" : "Open QR"}
                </button>
              </>
            ) : isWaitlisted ? (
              <span className="badge text-bg-warning px-3 py-2 rounded-pill">
                You are on the waitlist
              </span>
            ) : (
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={onRegister}
                disabled={deadlinePassed || isPast}
              >
                {deadlinePassed ? "Registration Closed" : "Register Now"}
              </button>
            )}
          </div>
        </div>

        {isRegistered && showQr ? (
          <div className="mt-4">
          <div
              className="event-modal-qr mx-auto rounded-4 border shadow-sm bg-white overflow-hidden"
              style={{ maxWidth: "320px" }}
            >
              <div className="event-modal-qr-head px-3 py-2 border-bottom bg-light text-center">
                <h6 className="mb-1 fw-bold">Event Entry QR</h6>
                <p className="small text-secondary mb-0">{event.title}</p>
              </div>
              <div className="p-3 text-center">
                <img
                  src={qrImageUrl}
                  alt="QR pass"
                  className="img-fluid rounded-3 border bg-white p-2"
                  width="220"
                  height="220"
                />
                <p className="small text-secondary mb-0 mt-3">
                  Open this QR photo and show it for scanning.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EventModal;
