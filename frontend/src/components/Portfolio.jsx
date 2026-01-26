import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { portfolioProjects } from '../mock';

const Portfolio = () => {
  return (
    <section className="portfolio-section" id="portfolio">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Work</h2>
          <p className="section-description">
            A showcase of landing pages we've crafted for businesses like yours.
          </p>
        </div>
        
        <div className="portfolio-grid">
          {portfolioProjects.map((project) => (
            <Card key={project.id} className="portfolio-card">
              <div className="portfolio-image-placeholder">
                <span className="portfolio-placeholder-text">{project.title}</span>
              </div>
              <CardHeader>
                <div className="portfolio-header">
                  <CardTitle className="portfolio-title">{project.title}</CardTitle>
                  <span className="portfolio-category">{project.category}</span>
                </div>
                <CardDescription className="portfolio-description">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="portfolio-tags">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="portfolio-tag">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;