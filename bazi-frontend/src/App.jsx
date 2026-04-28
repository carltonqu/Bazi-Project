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

// Fortune Results Section
function FortuneResultsSection() {
  const [activeTab, setActiveTab] = useState("relationship");

  const fortuneData = {
    relationship: {
      title: "Relationship",
      icon: "❤️",
      reading: "Your Bazi chart indicates strong water elements, suggesting deep emotional connections. You are most compatible with those born in the Year of the Dragon or Monkey. Your ideal partner should have strong earth elements to balance your water nature.",
      advice: "Focus on building trust through open communication. Avoid relationships with those who have conflicting fire elements."
    },
    career: {
      title: "Career",
      icon: "💼",
      reading: "Your chart shows a dominant metal element, indicating success in structured environments. Careers in finance, technology, or management will bring you fulfillment. Your leadership qualities will shine in positions of authority.",
      advice: "Seek opportunities that allow you to organize and structure. Avoid overly creative or chaotic work environments."
    },
    lifestyle: {
      title: "Lifestyle",
      icon: "🌿",
      reading: "Your wood element suggests a need for growth and expansion. You thrive in environments with nature and greenery. Regular exercise, especially outdoors, will enhance your energy and well-being.",
      advice: "Incorporate more green spaces into your living environment. Practice meditation near water or trees to balance your energy."
    },
    future: {
      title: "Future",
      icon: "🔮",
      reading: "The coming year brings opportunities for transformation. Your luck cycle shows a shift toward prosperity in the autumn months. Major life decisions should be made after careful consideration of your elemental balance.",
      advice: "Prepare for changes in the coming months. Stay adaptable and embrace new opportunities that align with your core strengths."
    },
    problems: {
      title: "Problems & Solutions",
      icon: "⚡",
      reading: "Current challenges stem from an imbalance between your fire and water elements. You may experience stress or conflict in relationships. The solution lies in introducing more earth elements through grounding practices.",
      advice: "Practice mindfulness and grounding exercises. Wear earth-tone colors and spend time in nature to restore balance."
    },
    strengths: {
      title: "Strengths & Weaknesses",
      icon: "💪",
      reading: "Your greatest strength is your adaptability and intuition. You can read situations and people well. However, your weakness is overthinking and indecision when faced with too many options.",
      advice: "Trust your instincts more. Set clear goals to avoid analysis paralysis. Surround yourself with decisive people who complement your nature."
    },
    colors: {
      title: "Lucky Colors",
      icon: "🎨",
      reading: "Your lucky colors are deep blue, emerald green, and silver. These colors enhance your water and metal elements. Avoid excessive red or orange as they may overstimulate your fire element.",
      advice: "Wear blue or green for important meetings or dates. Use silver accessories to enhance your natural charm and authority."
    },
    luck: {
      title: "Luck Days & Months",
      icon: "📅",
      reading: "Your luckiest days are Tuesday and Saturday. The most fortunate months are October and February. During these times, your natural abilities are enhanced and opportunities flow more easily.",
      advice: "Schedule important events on your lucky days. Use October for career moves and February for relationship developments."
    }
  };

  const tabs = Object.keys(fortuneData);

  return (
    <section className="fortune-results-section" id="results">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Your Fortune Report</span>
          <h2 className="section-title">Personalized Insights</h2>
          <p className="section-subtitle">
            Comprehensive analysis of your Bazi chart across all life areas
          </p>
        </div>

        <div className="results-container">
          {/* Tab Navigation */}
          <div className="results-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`result-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="tab-icon">{fortuneData[tab].icon}</span>
                <span className="tab-label">{fortuneData[tab].title}</span>
              </button>
            ))}
          </div>

          {/* Result Content */}
          <div className="result-content">
            <div className="result-card">
              <div className="result-header">
                <span className="result-icon">{fortuneData[activeTab].icon}</span>
                <h3>{fortuneData[activeTab].title}</h3>
              </div>
              <div className="result-body">
                <div className="reading-section">
                  <h4>Reading</h4>
                  <p>{fortuneData[activeTab].reading}</p>
                </div>
                <div className="advice-section">
                  <h4>Advice</h4>
                  <p>{fortuneData[activeTab].advice}</p>
                </div>
              </div>
            </div>
          </div>
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
      <FortuneResultsSection />
      <ComingSoonSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
