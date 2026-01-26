import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, Phone, Instagram } from 'lucide-react';
import { contactInfo } from '../mock';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // This is a placeholder - no actual email sending
    toast({
      title: "Message Received!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Let's Work Together</h2>
          <p className="section-description">
            Ready to bring your vision to life? Reach out and let's create something amazing.
          </p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info-wrapper">
            <Card className="contact-info-card">
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
                <CardDescription>
                  We're here to answer your questions and discuss your project.
                </CardDescription>
              </CardHeader>
              <CardContent className="contact-info-list">
                <div className="contact-info-item">
                  <Mail size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="contact-link">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Phone size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Phone</p>
                    <p className="contact-value">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Instagram size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Instagram</p>
                    <p className="contact-value">{contactInfo.instagram}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="contact-form-card">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="contact-submit-btn">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;