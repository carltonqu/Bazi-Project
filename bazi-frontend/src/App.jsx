import { useState, useEffect } from "react";
import "./App.css";

// Navigation Component - Dark Style
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
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <a href="#coming-soon" className="nav-cta">Get Started</a>
      </div>
    </nav>
  );
}

// Hero Section - Dark Immersive Style
function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-bg-image" />
        <div className="hero-bg-overlay" />
      </div>
      <div className="hero-content">
        {/* Centered Logo Symbol */}
        <div className="hero-logo">
          <div className="logo-circle">
            <span>八字</span>
          </div>
        </div>
        
        <h1 className="hero-title">
          Discover Your Destiny
        </h1>
        <p className="hero-subtitle">
          Explore the ancient art of Chinese metaphysics through your unique birth chart.
          Discover insights about your destiny, career path, and relationships.
        </p>
        <div className="hero-ctas">
          <a href="#coming-soon" className="hero-cta-primary">
            Get Started
          </a>
        </div>
        
        {/* Trust badges */}
        <div className="trust-badges">
          <span>Trusted by seekers worldwide</span>
          <div className="badge-icons">
            <span>☯️</span>
            <span>🐉</span>
            <span>🎋</span>
            <span>🏔️</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Bazi Fortune Form Section
function FortuneFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    gender: "",
    lifeProblem: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would normally send data to backend
    console.log("Form submitted:", formData);
  };

  return (
    <section className="fortune-form-section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Generate Your Report</span>
          <h2 className="section-title">Enter Your Birth Details</h2>
          <p className="section-subtitle">
            Fill in your information to receive a personalized Bazi fortune reading
          </p>
        </div>

        {submitted ? (
          <div className="form-success">
            <div className="success-icon">✦</div>
            <h3>Your Fortune Report is Being Generated</h3>
            <p>We&apos;re analyzing your birth chart using ancient Chinese metaphysics. Your personalized report will be ready shortly.</p>
            <button 
              className="btn-secondary" 
              onClick={() => setSubmitted(false)}
            >
              Generate Another Report
            </button>
          </div>
        ) : (
          <form className="bazi-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="birthTime">Birth Time</label>
                <input
                  type="time"
                  id="birthTime"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="birthLocation">Birth Location</label>
                <input
                  type="text"
                  id="birthLocation"
                  name="birthLocation"
                  value={formData.birthLocation}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="prefer_not_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="lifeProblem">What would you like guidance on?</label>
              <textarea
                id="lifeProblem"
                name="lifeProblem"
                value={formData.lifeProblem}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your current situation or questions (career, relationships, life direction...)"
                required
              />
            </div>

            <div className="form-submit">
              <button type="submit" className="btn-generate">
                <span>Generate Fortune Report</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
        )}
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
      <FortuneFormSection />
      <HowItWorksSection />
      <ComingSoonSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
