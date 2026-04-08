import React from 'react'
import { useState, useEffect } from 'react'

const Hackathons = () => {
  const hackathons = [
    {
      id: 1,
      title: "CodeFest 2026",
      date: "2026-05-01",
      prize: "₹50,000"
    },
    {
      id: 2,
      title: "Hack India",
      date: "2026-06-10",
      prize: "₹1,00,000"
    }
  ];

  const [openAll, setOpenAll] = useState(true);
  const [openMy, setOpenMy] = useState(false);

  return (
    <div>

      {/* 🔹 ALL HACKATHONS */}
      <h2
        onClick={() => {
          setOpenAll(true);
          setOpenMy(false);
        }}
        style={{ cursor: "pointer" }}
      >
        ▶ All Hackathons
      </h2>

      {openAll && (
        <div>
          {hackathons.map((h) => (
            <div
              key={h.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                margin: "10px 0"
              }}
            >
              <h3>{h.title}</h3>
              <p>Date: {h.date}</p>
              <p>Prize: {h.prize}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 MY HACKATHONS */}
      <h2
        onClick={() => {
          setOpenAll(false);
          setOpenMy(true);
        }}
        style={{ cursor: "pointer" }}
      >
        ▶ My Hackathons
      </h2>

      {openMy && (
        <div>
          {hackathons.map((h) => (
            <div
              key={h.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                margin: "10px 0"
              }}
            >
              <h3>{h.title}</h3>
              <p>Date: {h.date}</p>
              <p>Prize: {h.prize}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Hackathons
