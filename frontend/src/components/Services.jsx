import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Palette, Zap, TrendingUp } from 'lucide-react';
import { services } from '../mock';

const iconMap = {
  1: Palette,
  2: TrendingUp,
  3: Zap
};

const Services = () => {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-description">
            Specialized landing page design services tailored to elevate your small business online presence.
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service) => {
            const Icon = iconMap[service.id];
            return (
              <Card key={service.id} className="service-card">
                <CardHeader>
                  <div className="service-icon">
                    <Icon size={32} />
                  </div>
                  <CardTitle className="service-title">{service.title}</CardTitle>
                  <CardDescription className="service-description">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index} className="service-feature-item">{feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;