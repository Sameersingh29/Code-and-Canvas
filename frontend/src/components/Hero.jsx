import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1549399905-5d1bad747576?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzY5NDQ2OTQ2fDA&ixlib=rb-4.1.0&q=85"
          alt="Modern workspace"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">Code and Canvas</h1>
        <p className="hero-tagline">Your vision our code</p>
        <p className="hero-description">
          We transform your business ideas into stunning, high-converting landing pages that captivate your audience and drive results.
        </p>
        <div className="hero-cta">
          <Button onClick={scrollToContact} className="hero-button-primary">
            Get Started <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="hero-button-secondary"
          >
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;