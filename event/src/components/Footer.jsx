import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer py-3 px-2">
      <ul className="nav justify-content-center border-bottom pb-2 mb-2">
        <li className="nav-item">
          <a href="#" className="nav-link px-2 text-body-secondary">Home</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link px-2 text-body-secondary">Features</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link px-2 text-body-secondary">Pricing</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link px-2 text-body-secondary">FAQs</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link px-2 text-body-secondary">About</a>
        </li>
      </ul>
      <p className="text-center text-body-secondary mb-0">
        © 2025 Company, Inc
      </p>
    </footer>
  );
};

export default Footer;
