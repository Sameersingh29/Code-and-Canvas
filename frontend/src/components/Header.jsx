import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-text">Code and Canvas</span>
        </div>
        
        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <button onClick={() => scrollToSection('services')} className="nav-link">
            Services
          </button>
          <button onClick={() => scrollToSection('portfolio')} className="nav-link">
            Portfolio
          </button>
          <button onClick={() => scrollToSection('benefits')} className="nav-link">
            Why Us
          </button>
          <button onClick={() => scrollToSection('contact')} className="nav-link">
            Contact
          </button>
        </nav>

        <div className="header-cta">
          <Button onClick={() => scrollToSection('contact')} className="header-button">
            Get Started
          </Button>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => scrollToSection('services')} className="mobile-nav-link">
            Services
          </button>
          <button onClick={() => scrollToSection('portfolio')} className="mobile-nav-link">
            Portfolio
          </button>
          <button onClick={() => scrollToSection('benefits')} className="mobile-nav-link">
            Why Us
          </button>
          <button onClick={() => scrollToSection('contact')} className="mobile-nav-link">
            Contact
          </button>
          <Button onClick={() => scrollToSection('contact')} className="mobile-cta-button">
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;