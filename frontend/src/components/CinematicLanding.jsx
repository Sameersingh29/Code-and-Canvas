import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, Menu, X, Mail, Phone, Instagram, Palette, Zap, TrendingUp, Clock, DollarSign, Sparkles, Smartphone, Headphones, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Custom hook for responsive detection
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
};

// Email validation helper
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

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

// Header Component - Fully Responsive
const Header = ({ currentSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLightSection = currentSection === 4; // Contact section (index 4)

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
        isLightSection ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-2.5 xs:py-3 sm:py-4 flex items-center justify-between">
        <motion.div
          className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold tracking-tight"
          whileHover={{ scale: 1.02 }}
        >
          <span className={`bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent`}>
            Code and Canvas
          </span>
        </motion.div>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          {['Home', 'Services', 'Portfolio', 'Why Us', 'Contact'].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`text-xs xl:text-sm font-medium transition-all duration-300 hover:opacity-100 ${
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
          className="hidden lg:flex bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 text-xs xl:text-sm px-4 xl:px-6 py-2"
        >
          Get Started
        </Button>

        <button
          className="lg:hidden p-2 -mr-2 touch-manipulation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className={isLightSection ? 'text-gray-900' : 'text-white'} size={22} />
          ) : (
            <Menu className={isLightSection ? 'text-gray-900' : 'text-white'} size={22} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-white/10"
          >
            <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 flex flex-col gap-1">
              {['Home', 'Services', 'Portfolio', 'Why Us', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(index)}
                  className={`text-left py-2.5 xs:py-3 px-2 text-sm xs:text-base sm:text-lg rounded-lg transition-colors touch-manipulation ${
                    currentSection === index
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection(4)}
                className="mt-3 xs:mt-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 w-full py-2.5 xs:py-3"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Hero Section with Dramatic Parallax - Fully Responsive
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // More dramatic parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.9]);

  const scrollToNext = () => {
    const sections = document.querySelectorAll('.snap-section');
    if (sections[1]) {
      sections[1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="snap-section relative h-screen w-full overflow-hidden">
      {/* Dramatic Parallax Background */}
      <motion.div 
        style={{ y: backgroundY, scale: backgroundScale }} 
        className="absolute inset-0 w-full h-[150%] -top-[25%]"
      >
        <img
          src="https://images.unsplash.com/photo-1549399905-5d1bad747576?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzY5NDQ2OTQ2fDA&ixlib=rb-4.1.0&q=85"
          alt="Modern workspace"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Dynamic Overlay */}
      <motion.div 
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-violet-950/50" 
      />

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-violet-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content with Parallax */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 h-full flex flex-col justify-center px-4 xs:px-5 sm:px-6 md:px-12 lg:px-16 xl:px-24 pt-14 xs:pt-16 sm:pt-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white leading-[1.1] tracking-tight"
        >
          Code and Canvas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-1.5 xs:mt-2 sm:mt-4 text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-300 italic font-light"
        >
          Your vision our code
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-3 xs:mt-4 sm:mt-6 text-xs xs:text-sm sm:text-base md:text-lg text-gray-400 max-w-xl leading-relaxed"
        >
          We transform your business ideas into stunning, high-converting landing pages that captivate your audience and drive results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-5 xs:mt-6 sm:mt-10 flex flex-col xs:flex-row gap-3 xs:gap-4"
        >
          <Button
            onClick={scrollToNext}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-5 xs:px-6 sm:px-8 py-4 xs:py-5 sm:py-6 text-sm xs:text-base sm:text-lg rounded-lg w-full xs:w-auto touch-manipulation"
          >
            Explore <ArrowRight className="ml-2" size={18} />
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Hidden on very small screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 xs:bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10 hidden xs:flex"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center cursor-pointer touch-manipulation"
          onClick={scrollToNext}
        >
          <span className="text-white/60 text-xs sm:text-sm mb-2">Scroll</span>
          <ArrowDown className="text-white/60" size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Full Screen Section with AI Generated Background and Dramatic Parallax
const FullScreenSection = ({ title, subtitle, children, imagePrompt, sectionId, fallbackImage }) => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Dramatic parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

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
        setBackgroundImage(fallbackImage);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [imagePrompt, sectionId, fallbackImage]);

  return (
    <section ref={ref} className="snap-section relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 w-full h-[140%] -top-[20%]"
      >
        {isLoading ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-violet-950 to-black flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-6 h-6 xs:w-8 xs:h-8 sm:w-12 sm:h-12 border-3 xs:border-4 border-violet-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </motion.div>
      
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content with Parallax */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full flex flex-col justify-center items-center px-3 xs:px-4 sm:px-6 md:px-12 lg:px-16 pt-14 xs:pt-16 sm:pt-20 pb-6 xs:pb-8 sm:pb-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-4 xs:mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 xs:mb-3 sm:mb-4 px-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              {subtitle}
            </p>
          )}
        </motion.div>

        {children}
      </motion.div>
    </section>
  );
};

// Services Content - Fully Responsive
const ServicesContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 max-w-6xl mx-auto w-full px-2 xs:px-3 sm:px-4"
  >
    {servicesData.map((service, index) => (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white/10 backdrop-blur-md rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-violet-500/50 transition-all duration-300"
      >
        <service.icon className="text-violet-400 mb-2 xs:mb-3 sm:mb-4" size={24} />
        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-1.5 xs:mb-2">{service.title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm mb-2 xs:mb-3 sm:mb-4 line-clamp-3">{service.description}</p>
        <ul className="space-y-1">
          {service.features.map((feature, i) => (
            <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
              <span className="w-1 h-1 bg-violet-400 rounded-full flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </motion.div>
);

// Portfolio Content - Fully Responsive
const PortfolioContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 max-w-6xl mx-auto w-full px-2 xs:px-3 sm:px-4"
  >
    {portfolioData.map((project, index) => (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white/10 backdrop-blur-md rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-6 border border-white/20 hover:bg-white/15 hover:border-violet-500/50 transition-all duration-300 group cursor-pointer"
      >
        <span className="text-[10px] xs:text-xs text-violet-400 font-medium uppercase tracking-wider">{project.category}</span>
        <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white mt-1.5 xs:mt-2 mb-1.5 xs:mb-2 group-hover:text-violet-300 transition-colors">{project.title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{project.description}</p>
      </motion.div>
    ))}
  </motion.div>
);

// Benefits Content - Fully Responsive with improved grid
const BenefitsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    viewport={{ once: true }}
    className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 max-w-6xl mx-auto w-full px-2 xs:px-3 sm:px-4"
  >
    {benefitsData.map((benefit, index) => (
      <motion.div
        key={benefit.id}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, y: -3 }}
        className="bg-white/10 backdrop-blur-md rounded-lg xs:rounded-xl p-2.5 xs:p-3 sm:p-4 border border-white/20 text-center hover:bg-white/15 hover:border-violet-500/50 transition-all duration-300"
      >
        <benefit.icon className="text-violet-400 mx-auto mb-1.5 xs:mb-2 sm:mb-3" size={20} />
        <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-white mb-0.5 xs:mb-1">{benefit.title}</h3>
        <p className="text-gray-400 text-[9px] xs:text-[10px] sm:text-xs leading-relaxed hidden xs:block line-clamp-2">{benefit.description}</p>
      </motion.div>
    ))}
  </motion.div>
);

// Contact Section (Light theme) - Fully Responsive with Email Validation
const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Reset submit status when user edits
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  // Handle blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      toast({
        title: "Please fix the errors",
        description: "Check the form for validation errors.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send message');
      }
      
      setSubmitStatus('success');
      toast({
        title: "Message Sent! ✨",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="snap-section relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="min-h-screen flex flex-col justify-start sm:justify-center items-center px-3 xs:px-4 sm:px-6 md:px-12 lg:px-16 pt-16 xs:pt-20 sm:pt-24 pb-12 xs:pb-14 sm:pb-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-4 xs:mb-6 sm:mb-10"
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto px-2">
            Ready to bring your vision to life? Reach out and let&apos;s create something amazing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 lg:gap-8"
        >
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 text-white order-2 md:order-1">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4 sm:mb-6">Get In Touch</h3>
            <div className="space-y-3 xs:space-y-4 sm:space-y-6">
              <div className="flex items-start gap-2.5 xs:gap-3 sm:gap-4">
                <Mail className="mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                <div className="min-w-0">
                  <p className="text-white/70 text-[10px] xs:text-xs sm:text-sm">Email</p>
                  <a href="mailto:inquirecodeandcanvas@gmail.com" className="hover:underline text-xs xs:text-sm sm:text-base break-all">inquirecodeandcanvas@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-2.5 xs:gap-3 sm:gap-4">
                <Phone className="mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-white/70 text-[10px] xs:text-xs sm:text-sm">Phone</p>
                  <p className="text-xs xs:text-sm sm:text-base">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 xs:gap-3 sm:gap-4">
                <Instagram className="mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-white/70 text-[10px] xs:text-xs sm:text-sm">Instagram</p>
                  <p className="text-xs xs:text-sm sm:text-base">@codeandcanvas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form with Validation */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-xl border border-gray-100 order-1 md:order-2">
            <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
              {/* Name Field */}
              <div>
                <label className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your name"
                  className={`border-gray-200 focus:border-violet-500 text-xs xs:text-sm sm:text-base h-9 xs:h-10 sm:h-11 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-[10px] xs:text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>
              
              {/* Email Field */}
              <div>
                <label className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  className={`border-gray-200 focus:border-violet-500 text-xs xs:text-sm sm:text-base h-9 xs:h-10 sm:h-11 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] xs:text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Message Field */}
              <div>
                <label className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us about your project..."
                  rows={3}
                  className={`border-gray-200 focus:border-violet-500 text-xs xs:text-sm sm:text-base resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="mt-1 text-[10px] xs:text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.message}
                  </p>
                )}
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 xs:py-5 sm:py-6 text-xs xs:text-sm sm:text-base touch-manipulation transition-all duration-300 ${
                  submitStatus === 'success' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : submitStatus === 'error'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Message Sent!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                ) : (
                  'Send Message'
                )}
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
          className="mt-6 xs:mt-8 sm:mt-12 text-center text-gray-500 text-[10px] xs:text-xs sm:text-sm"
        >
          © {new Date().getFullYear()} Code and Canvas. All rights reserved.
        </motion.div>
      </motion.div>
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
