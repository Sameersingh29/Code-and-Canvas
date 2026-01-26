import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, DollarSign, Sparkles, Smartphone, Headphones } from 'lucide-react';
import { benefits } from '../mock';

const iconMap = {
  1: Clock,
  2: DollarSign,
  3: Sparkles,
  4: Smartphone,
  5: Headphones
};

const Benefits = () => {
  return (
    <section className="benefits-section" id="benefits">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Code and Canvas</h2>
          <p className="section-description">
            We're committed to delivering exceptional value and results for small businesses.
          </p>
        </div>
        
        <div className="benefits-grid">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.id];
            return (
              <Card key={benefit.id} className="benefit-card">
                <CardHeader>
                  <div className="benefit-icon">
                    <Icon size={28} />
                  </div>
                  <CardTitle className="benefit-title">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="benefit-description">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;