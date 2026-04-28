import { useState, useEffect } from "react";
import "./App.css";

// Navigation Component
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        <a href="#" className="nav-logo">
          <span className="nav-logo-icon">八字</span>
          <span className="nav-logo-text">Bazi</span>
        </a>
        <div className="nav-links">
          <a href="#hero" className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <a href="#coming-soon" className="nav-cta">Get Started</a>
      </div>
    </nav>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-bg-image" />
        <div className="hero-bg-overlay" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-icon">✦</span>
          Ancient Wisdom Meets Modern Insight
        </div>
        <h1 className="hero-title">
          Discover Your Destiny
        </h1>
        <p className="hero-subtitle">
          Unlock the secrets of your birth chart with AI-powered Bazi fortune telling.
          <br />
          Understand yourself, your career, and your relationships.
        </p>
        <div className="hero-ctas">
          <a href="#coming-soon" className="hero-cta-primary">
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#about" className="hero-cta-secondary">
            Learn More
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: "🌙",
      title: "Personal Reading",
      description: "Get insights tailored to your unique birth chart based on date, time, and location."
    },
    {
      icon: "⚡",
      title: "Five Elements",
      description: "Discover how Wood, Fire, Earth, Metal, and Water shape your personality and destiny."
    },
    {
      icon: "💼",
      title: "Career Guidance",
      description: "Find your optimal career path and understand your professional strengths."
    },
    {
      icon: "❤️",
      title: "Relationship Insights",
      description: "Understand your compatibility and relationship dynamics with others."
    },
    {
      icon: "🎯",
      title: "Life Goals",
      description: "Align your ambitions with your cosmic blueprint for greater success."
    },
    {
      icon: "🔮",
      title: "Future Trends",
      description: "Navigate upcoming opportunities and challenges with confidence."
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">What You&apos;ll Discover</h2>
          <p className="section-subtitle">
            Comprehensive insights across five key areas of your life
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Enter Your Details",
      description: "Share your birth date, time, and location for accurate calculations."
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our advanced AI interprets your Bazi chart using ancient wisdom."
    },
    {
      number: "03",
      title: "Get Your Reading",
      description: "Receive personalized insights and actionable guidance."
    }
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">How It Works</span>
          <h2 className="section-title">Three Simple Steps</h2>
          <p className="section-subtitle">
            Your personalized fortune reading in minutes
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Coming Soon Section (replaces the form)
function ComingSoonSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="coming-soon-section" id="coming-soon">
      <div className="container">
        <div className="coming-soon-content">
          <span className="section-badge">Coming Soon</span>
          <h2 className="section-title">Be the First to Know</h2>
          <p className="section-subtitle">
            We&apos;re putting the finishing touches on our AI-powered Bazi fortune teller.
            <br />
            Sign up to get early access when we launch.
          </p>
          
          {submitted ? (
            <div className="success-message">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#28a745" fillOpacity="0.1"/>
                <path d="M16 24L21 29L32 18" stroke="#28a745" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Thanks! We&apos;ll notify you when we launch.</p>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Join Waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <span className="section-badge">About Bazi</span>
            <h2 className="section-title">Ancient Wisdom for Modern Life</h2>
            <p>
              Bazi (八字), or &quot;Eight Characters,&quot; is a traditional Chinese metaphysical 
              system that has been used for thousands of years to understand human destiny. 
              By analyzing the cosmic energy at the moment of your birth, Bazi reveals 
              insights about your personality, strengths, challenges, and life path.
            </p>
            <p>
              Our platform combines this ancient wisdom with modern AI technology to provide 
              personalized, actionable guidance for your career, relationships, and personal growth.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Years of Wisdom</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Key Life Areas</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Possibilities</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              <span>八字</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">八字 Bazi</span>
            <p>Ancient wisdom. Modern insight.</p>
          </div>
          <div className="footer-links">
            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Bazi Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main App
export default function App() {
  return (
    <div className="app">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ComingSoonSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
