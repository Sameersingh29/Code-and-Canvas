import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, Menu, X, Mail, Phone, Instagram, Palette, Zap, TrendingUp, Clock, DollarSign, Sparkles, Smartphone, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Section data
const servicesData = [
  { id: 1, icon: Palette, title: "Custom Landing Pages", description: "Tailored landing pages designed to capture your brand's unique personality and drive conversions.", features: ["Custom Design", "Mobile Responsive", "Fast Loading", "SEO Optimized"] },
  { id: 2, icon: TrendingUp, title: "Conversion Optimization", description: "Strategic design focused on turning visitors into customers with compelling CTAs and user flows.", features: ["A/B Testing Ready", "Clear CTAs", "User-Centered Design", "Analytics Integration"] },
  { id: 3, icon: Zap, title: "Rapid Deployment", description: "Get your landing page live quickly without compromising on quality or functionality.", features: ["Quick Turnaround", "Launch Support", "Training Included", "Maintenance Available"] }
];

const portfolioData = [
  { id: 1, title: "Artisan Bakery Co.", category: "Food & Beverage", description: "A warm and inviting landing page for a local bakery." },
  { id: 2, title: "FitLife Coaching", category: "Health & Fitness", description: "High-conversion landing page for a fitness coaching business." },
  { id: 3, title: "TechStart Consulting", category: "Technology", description: "Corporate landing page for a tech consulting firm." }
];

const benefitsData = [
  { id: 1, icon: Clock, title: "Fast Turnaround", description: "Get your landing page designed and deployed in days, not weeks." },
  { id: 2, icon: DollarSign, title: "Affordable Pricing", description: "Professional web design shouldn't break the bank." },
  { id: 3, icon: Sparkles, title: "Custom Designs", description: "Every project is crafted from scratch to match your unique brand." },
  { id: 4, icon: Smartphone, title: "Fully Responsive", description: "Stunning and functional on every device." },
  { id: 5, icon: Headphones, title: "Ongoing Support", description: "Continued support and updates to keep your site running smoothly." }
];

// Header Component
const Header = ({ currentSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLightSection = currentSection === 3; // Contact section

  const scrollToSection = (index) => {
    const sections = document.querySelectorAll('.snap-section');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLightSection ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="text-2xl font-bold tracking-tight"
          whileHover={{ scale: 1.02 }}
        >
          <span className={`bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent`}>
            Code and Canvas
          </span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'Services', 'Portfolio', 'Why Us', 'Contact'].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`text-sm font-medium transition-all duration-300 hover:opacity-100 ${
                currentSection === index
                  ? isLightSection ? 'text-violet-600 opacity-100' : 'text-white opacity-100'
                  : isLightSection ? 'text-gray-600 opacity-70 hover:text-violet-600' : 'text-white/70 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <Button
          onClick={() => scrollToSection(4)}
          className="hidden md:flex bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0"
        >
          Get Started
        </Button>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={isLightSection ? 'text-gray-900' : 'text-white'} size={24} />
          ) : (
            <Menu className={isLightSection ? 'text-gray-900' : 'text-white'} size={24} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-lg"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {['Home', 'Services', 'Portfolio', 'Why Us', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(index)}
                  className="text-white/80 hover:text-white text-left py-2 text-lg"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Hero Section with Parallax
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToNext = () => {
    const sections = document.querySelectorAll('.snap-section');
    if (sections[1]) {
      sections[1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="snap-section relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[130%]">
        <img
          src="https://images.unsplash.com/photo-1549399905-5d1bad747576?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzY5NDQ2OTQ2fDA&ixlib=rb-4.1.0&q=85"
          alt="Modern workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight"
        >
          Code and Canvas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-xl md:text-2xl lg:text-3xl text-gray-300 italic font-light"
        >
          Your vision our code
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-6 text-base md:text-lg text-gray-400 max-w-xl leading-relaxed"
        >
          We transform your business ideas into stunning, high-converting landing pages that captivate your audience and drive results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={scrollToNext}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg"
          >
            Explore <ArrowRight className="ml-2" size={20} />
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center cursor-pointer"
          onClick={scrollToNext}
        >
          <span className="text-white/60 text-sm mb-2">Scroll</span>
          <ArrowDown className="text-white/60" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Full Screen Section with AI Generated Background
const FullScreenSection = ({ title, subtitle, children, imagePrompt, sectionId, fallbackImage }) => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt, section_id: sectionId })
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

        const data = await response.json();
        setBackgroundImage(`data:image/png;base64,${data.image_data}`);
      } catch (err) {
        console.error('Image generation error:', err);
        setError(err.message);
        // Use fallback image
        setBackgroundImage(fallbackImage);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [imagePrompt, sectionId, fallbackImage]);

  return (
    <section className="snap-section relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {isLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-violet-950 to-black flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            <img
              src={backgroundImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {children}
      </div>
    </section>
  );
};

// Services Content
const ServicesContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4"
  >
    {servicesData.map((service, index) => (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
      >
        <service.icon className="text-violet-400 mb-4" size={36} />
        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{service.description}</p>
        <ul className="space-y-1">
          {service.features.map((feature, i) => (
            <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
              <span className="w-1 h-1 bg-violet-400 rounded-full" />
              {feature}
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </motion.div>
);

// Portfolio Content
const PortfolioContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4"
  >
    {portfolioData.map((project, index) => (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
      >
        <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">{project.category}</span>
        <h3 className="text-xl font-semibold text-white mt-2 mb-2 group-hover:text-violet-300 transition-colors">{project.title}</h3>
        <p className="text-gray-400 text-sm">{project.description}</p>
      </motion.div>
    ))}
  </motion.div>
);

// Benefits Content
const BenefitsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
    className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto w-full px-4"
  >
    {benefitsData.map((benefit, index) => (
      <motion.div
        key={benefit.id}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all duration-300"
      >
        <benefit.icon className="text-violet-400 mx-auto mb-3" size={28} />
        <h3 className="text-sm font-semibold text-white mb-1">{benefit.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed">{benefit.description}</p>
      </motion.div>
    ))}
  </motion.div>
);

// Contact Section (Light theme)
const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({ title: "Message Received!", description: "Thank you for reaching out. We'll get back to you soon." });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="snap-section relative h-screen w-full bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="h-full flex flex-col justify-center items-center px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Ready to bring your vision to life? Reach out and let's create something amazing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="mt-1" size={20} />
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <a href="mailto:inquirecodeandcanvas@gmail.com" className="hover:underline">inquirecodeandcanvas@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1" size={20} />
                <div>
                  <p className="text-white/70 text-sm">Phone</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Instagram className="mt-1" size={20} />
                <div>
                  <p className="text-white/70 text-sm">Instagram</p>
                  <p>@codeandcanvas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="border-gray-200 focus:border-violet-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="border-gray-200 focus:border-violet-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="border-gray-200 focus:border-violet-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-6"
              >
                Send Message
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="absolute bottom-6 text-center text-gray-500 text-sm"
        >
          © {new Date().getFullYear()} Code and Canvas. All rights reserved.
        </motion.div>
      </div>
    </section>
  );
};

// Main Cinematic Landing Component
const CinematicLanding = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = container.querySelectorAll('.snap-section');
      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        if (scrollTop >= sectionTop - sectionHeight / 2 && scrollTop < sectionTop + sectionHeight / 2) {
          setCurrentSection(index);
        }
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      <Header currentSection={currentSection} />

      {/* Section 0: Hero */}
      <HeroSection />

      {/* Section 1: What We Offer */}
      <FullScreenSection
        title="What We Offer"
        subtitle="Specialized landing page design services tailored to elevate your small business online presence."
        imagePrompt="A cinematic view of a modern creative design studio with dramatic lighting, computer screens showing web designs, dark moody atmosphere with purple and blue accent lights"
        sectionId="services"
        fallbackImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"
      >
        <ServicesContent />
      </FullScreenSection>

      {/* Section 2: Our Work */}
      <FullScreenSection
        title="Our Work"
        subtitle="A showcase of landing pages we've crafted for businesses like yours."
        imagePrompt="A cinematic showcase of multiple website designs displayed on floating screens in a dark futuristic gallery space with dramatic spotlights and reflections"
        sectionId="portfolio"
        fallbackImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80"
      >
        <PortfolioContent />
      </FullScreenSection>

      {/* Section 3: Why Choose Us */}
      <FullScreenSection
        title="Why Choose Code and Canvas"
        subtitle="We're committed to delivering exceptional value and results for small businesses."
        imagePrompt="A cinematic scene of a successful business team celebration in a modern glass office at night with city lights in background, warm golden lighting mixed with cool blues"
        sectionId="benefits"
        fallbackImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
      >
        <BenefitsContent />
      </FullScreenSection>

      {/* Section 4: Contact */}
      <ContactSection />
    </div>
  );
};

export default CinematicLanding;
