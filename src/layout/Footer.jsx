// src/layout/Footer.jsx
import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Sabor y Gestión. Todos los derechos reservados.</p>
        <div className="social-links">
          <a href="#" className="social-icon">Facebook</a>
          <a href="#" className="social-icon">Instagram</a>
          <a href="#" className="social-icon">Twitter</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;