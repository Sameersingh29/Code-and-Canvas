import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">Code and Canvas</h3>
            <p className="footer-tagline">Your vision our code</p>
          </div>
          
          <div className="footer-links">
            <a href="#services" className="footer-link">Services</a>
            <a href="#portfolio" className="footer-link">Portfolio</a>
            <a href="#benefits" className="footer-link">Why Us</a>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Code and Canvas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;