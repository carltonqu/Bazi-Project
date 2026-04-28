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

// Bazi Fortune Form Section - Split Screen Design
function FortuneFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthLocation: "",
    gender: "",
    topic: "",
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
    console.log("Form submitted:", formData);
  };

  const topics = [
    { value: "", label: "Select a topic" },
    { value: "relationship", label: "Relationship & Love" },
    { value: "career", label: "Career & Business" },
    { value: "wealth", label: "Wealth & Finance" },
    { value: "health", label: "Health & Wellness" },
    { value: "family", label: "Family & Home" },
    { value: "education", label: "Education & Learning" },
    { value: "travel", label: "Travel & Relocation" },
    { value: "general", label: "General Life Guidance" }
  ];

  return (
    <section className="fortune-form-section" id="features">
      {submitted ? (
        <div className="container">
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
        </div>
      ) : (
        <div className="split-form-container">
          {/* Left Side - Form */}
          <div className="form-left-panel">
            <div className="form-header">
              <div className="form-logo">
                <span>八字</span>
              </div>
              <h2>Generate Your Report</h2>
              <p>Enter your birth details to receive your personalized Bazi fortune reading</p>
            </div>

            <form className="split-bazi-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-field">
                  <label htmlFor="birthDate">Birth Date *</label>
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
                  <label htmlFor="birthTime">Birth Time *</label>
                  <input
                    type="time"
                    id="birthTime"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="birthLocation">Birth Location *</label>
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
              </div>

              <div className="form-row two-col">
                <div className="form-field">
                  <label htmlFor="gender">Gender *</label>
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
                <div className="form-field">
                  <label htmlFor="topic">Topic of Interest *</label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                  >
                    {topics.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="lifeProblem">Your Question or Situation *</label>
                  <textarea
                    id="lifeProblem"
                    name="lifeProblem"
                    value={formData.lifeProblem}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe what you'd like guidance on..."
                    required
                  />
                </div>
              </div>

              <div className="form-submit">
                <button type="submit" className="btn-generate-split">
                  Generate Fortune Report
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Visual Panel */}
          <div className="form-right-panel">
            <div className="right-panel-content">
              <div className="panel-logo">
                <span>八字</span>
              </div>
              <h3>BAZI FORTUNE</h3>
              <p className="panel-tagline">Discover your destiny through ancient Chinese wisdom</p>
              
              <div className="panel-features">
                <div className="panel-feature">
                  <span className="feature-dot"></span>
                  <span>Personalized birth chart analysis</span>
                </div>
                <div className="panel-feature">
                  <span className="feature-dot"></span>
                  <span>8 life areas covered</span>
                </div>
                <div className="panel-feature">
                  <span className="feature-dot"></span>
                  <span>AI-powered insights</span>
                </div>
              </div>

              <div className="panel-footer">
                <div className="panel-stat">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Years of Wisdom</span>
                </div>
                <div className="panel-stat">
                  <span className="stat-number">八字</span>
                  <span className="stat-label">Eight Characters</span>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="panel-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
        </div>
      )}
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

// Why Bazi Section
function WhyBaziSection() {
  const benefits = [
    {
      icon: "🎯",
      title: "Discover Your Life Purpose",
      description: "Understand your innate talents, strengths, and the unique path you were born to follow."
    },
    {
      icon: "💼",
      title: "Career & Wealth Guidance",
      description: "Identify the most prosperous career paths and optimal timing for financial decisions."
    },
    {
      icon: "❤️",
      title: "Relationship Compatibility",
      description: "Find your ideal partner and understand relationship dynamics for lasting harmony."
    },
    {
      icon: "⏰",
      title: "Timing is Everything",
      description: "Know the best times to make important life decisions, start businesses, or find love."
    },
    {
      icon: "⚡",
      title: "Navigate Challenges",
      description: "Anticipate obstacles before they arise and prepare strategies to overcome them."
    },
    {
      icon: "🌟",
      title: "Unlock Your Potential",
      description: "Maximize your opportunities by aligning your actions with your cosmic blueprint."
    }
  ];

  return (
    <section className="why-bazi-section" id="why-bazi">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Why Bazi</span>
          <h2 className="section-title">Unlock Your Life&apos;s Blueprint</h2>
          <p className="section-subtitle">
            Discover how ancient Chinese wisdom can transform your modern life
          </p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Singapore",
      text: "The Bazi reading was incredibly accurate. It helped me understand why I kept facing the same career challenges and guided me toward a path that truly fits my nature.",
      rating: 5
    },
    {
      name: "Michael Wong",
      location: "Hong Kong",
      text: "I was skeptical at first, but the insights about my relationship patterns were spot on. The advice helped me find my soulmate and build a harmonious marriage.",
      rating: 5
    },
    {
      name: "Emily Liu",
      location: "Taipei",
      text: "The timing predictions were amazing. Following the guidance on when to start my business led to immediate success. I wish I had discovered Bazi years ago!",
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Testimonials</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Real stories from people whose lives have been transformed
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-stars">
                {"★".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Bazi (八字) and how does it work?",
      answer: "Bazi, also known as Four Pillars of Destiny, is an ancient Chinese metaphysical system that analyzes your birth date and time to reveal insights about your personality, strengths, challenges, and life path. It uses the Five Elements (Wood, Fire, Earth, Metal, Water) and Yin-Yang theory to interpret your cosmic blueprint."
    },
    {
      question: "How accurate is a Bazi reading?",
      answer: "Bazi has been practiced for over 5,000 years and is highly regarded for its accuracy in revealing personality traits, life patterns, and optimal timing. While it doesn't predict exact events, it provides valuable guidance about tendencies and opportunities based on your unique energy composition."
    },
    {
      question: "What information do I need to provide?",
      answer: "To generate your Bazi chart, we need your full name, birth date (year, month, day), exact birth time, and birth location. The more accurate your birth time, the more precise your reading will be."
    },
    {
      question: "Can Bazi help with career decisions?",
      answer: "Absolutely! Bazi can identify your natural talents, suitable career paths, and optimal timing for career changes or business ventures. It reveals which industries and roles align best with your elemental composition."
    },
    {
      question: "Is my personal information kept private?",
      answer: "Yes, we take your privacy seriously. Your birth details and personal information are encrypted and used solely for generating your Bazi reading. We never share your data with third parties."
    },
    {
      question: "How often should I get a Bazi reading?",
      answer: "Your Bazi chart is based on your birth data and remains constant throughout your life. However, we recommend checking your luck cycles annually, as different years bring different energies and opportunities that interact with your chart."
    }
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about Bazi readings
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item ${openIndex === index ? "open" : ""}`} 
              key={index}
            >
              <button 
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <svg 
                  className="faq-icon" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                >
                  <path 
                    d="M5 7.5L10 12.5L15 7.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Banner Section
function CTABannerSection() {
  return (
    <section className="cta-banner-section">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Discover Your Destiny?</h2>
          <p>Join thousands of seekers who have unlocked their life&apos;s blueprint with our AI-powered Bazi readings.</p>
          <a href="#features" className="cta-button">
            Get Your Free Reading
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
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
      <WhyBaziSection />
      <TestimonialsSection />
      <FAQSection />
      <CTABannerSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
