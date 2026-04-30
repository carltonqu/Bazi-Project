import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import "./pages/Auth.css";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";

// Navigation Component - Dark Style
function Navigation({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">八字</span>
          <span className="nav-logo-text">Bazi</span>
        </Link>
        <div className="nav-links">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#how-it-works" className="nav-link">How It Works</a>
          <a href="/#about" className="nav-link">About</a>
        </div>
        {user ? (
          <div className="nav-user">
            {user.picture && (
              <img 
                src={user.picture} 
                alt={user.name}
                className="nav-user-avatar"
              />
            )}
            <span className="nav-user-name">{user.name}</span>
            <button onClick={handleLogout} className="nav-cta">Logout</button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="nav-cta">Login</button>
        )}
      </div>
    </nav>
  );
}

// Hero Section - Dark Immersive Style
function HeroSection({ onGetStarted }) {
  const [hoveredDot, setHoveredDot] = useState(null);

  // Generate random dots for hero section
  const dots = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4
  }));

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-bg-image" />
        <div className="hero-bg-overlay" />

        {/* Moving dots */}
        <div className="hero-dots-container">
          {dots.map((dot) => (
            <div
              key={dot.id}
              className={`hero-dot ${hoveredDot === dot.id ? 'hero-dot-hovered' : ''}`}
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`
              }}
              onMouseEnter={() => setHoveredDot(dot.id)}
              onMouseLeave={() => setHoveredDot(null)}
            />
          ))}
        </div>
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
          <button onClick={onGetStarted} className="hero-cta-primary">
            Get Started
          </button>
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
    // Scroll to results section after a short delay
    setTimeout(() => {
      const resultsSection = document.getElementById('results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
        <div className="form-only-container">
          <div className="form-header-centered">
            <div className="form-logo-large">
              <span>八字</span>
            </div>
            <h2>Generate Your Report</h2>
            <p>Enter your birth details to receive your personalized Bazi fortune reading</p>
          </div>

          <form className="centered-bazi-form" onSubmit={handleSubmit}>
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

              <div className="form-submit-centered">
                <button type="submit" className="btn-generate-centered">
                  Generate Fortune Report
                </button>
              </div>
            </form>
        </div>
      )}
    </section>
  );
}

// Fortune Results Section
function FortuneResultsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const fortuneData = [
    {
      key: "relationship",
      title: "Relationship",
      icon: "❤️",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
      reading: [
        "Your chart shows deep emotional intelligence with a strong Water influence. You naturally detect emotional shifts and value sincerity over surface chemistry.",
        "You are romantic but selective. Attraction comes quickly, but long-term trust forms only through consistency, emotional maturity, and shared direction.",
        "When work pressure rises, you may become quieter and more protective. This can look like distance, even when your intention is stability.",
        "Partnerships are strongest with grounded personalities who balance your emotional depth with practical steadiness and clear communication."
      ],
      readingPoints: [
        "Needs emotional safety and reliability",
        "Values depth over performative romance",
        "Sensitive to stress spillover from work",
        "Best harmony with calm, grounded partners"
      ],
      advice: [
        "Use regular emotional check-ins before tension accumulates. Small honest conversations prevent bigger misunderstandings.",
        "Agree on conflict rules: pause when heated, return with clarity, and focus on one issue at a time.",
        "Build repeatable rituals—date nights, shared planning, and quality time habits—to strengthen trust over time."
      ],
      advicePoints: [
        "Communicate early and consistently",
        "Create healthy conflict boundaries",
        "Protect weekly connection rituals"
      ]
    },
    {
      key: "career",
      title: "Career",
      icon: "💼",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      reading: [
        "Your profile is strong in strategy, process, and execution. You perform best where outcomes are clear and responsibility is real.",
        "Leadership appears as calm structure under pressure. People rely on your judgment when situations are complex or unclear.",
        "You naturally improve systems: reducing friction, clarifying priorities, and scaling what works.",
        "Long periods of role ambiguity drain you. You need autonomy plus defined accountability to stay fully engaged."
      ],
      readingPoints: [
        "Excellent at structured decision-making",
        "Natural operator and strategic problem-solver",
        "Strong fit for management and high-ownership roles",
        "Needs clarity in scope and metrics"
      ],
      advice: [
        "Choose opportunities by leverage, not only compensation: influence, ownership, and compounding skill growth.",
        "Document measurable wins continuously. Visible impact accelerates promotion and negotiation outcomes.",
        "Protect deep-focus blocks. Your best work happens in uninterrupted execution windows."
      ],
      advicePoints: [
        "Prioritize high-leverage roles",
        "Track outcomes with clear metrics",
        "Design your week for focused execution"
      ]
    },
    {
      key: "lifestyle",
      title: "Lifestyle",
      icon: "🌿",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      reading: [
        "Your vitality depends on rhythm, not intensity. Consistent routines stabilize both mood and performance.",
        "Nature and movement are energetic reset points for your chart. Stagnant or noisy environments reduce clarity.",
        "There is a strong space-mind connection: when your surroundings are cluttered, your thoughts become scattered.",
        "You are built for sustainable momentum—alternating focused effort with intentional recovery."
      ],
      readingPoints: [
        "Thrives on routine and environmental calm",
        "Benefits strongly from outdoor movement",
        "High sensitivity to workspace quality",
        "Needs structured recovery to prevent burnout"
      ],
      advice: [
        "Set a stable daily baseline: sleep window, hydration, and movement before high-demand tasks.",
        "Simplify your main environment. Less visual noise means better decisions and lower emotional friction.",
        "Treat rest as a performance system, not an afterthought. Recovery increases consistency and resilience."
      ],
      advicePoints: [
        "Anchor your day with simple non-negotiables",
        "Declutter spaces tied to focus",
        "Schedule recovery with the same priority as work"
      ]
    },
    {
      key: "future",
      title: "Future",
      icon: "🔮",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      reading: [
        "Your next cycle favors strategic preparation over impulsive expansion. The best outcomes come from aligned steps.",
        "Growth accelerates when you concentrate on fewer priorities with stronger conviction.",
        "A likely trajectory is moving from pure execution toward guidance, influence, and high-level decision roles.",
        "Patience is a multiplier in your chart—building credibility, capability, and trusted relationships before major leaps."
      ],
      readingPoints: [
        "Focus amplifies opportunity",
        "Leadership influence likely to increase",
        "Staged transitions outperform sudden jumps",
        "Long-term alignment beats short-term urgency"
      ],
      advice: [
        "Build a 12-month roadmap across skills, network, and financial stability.",
        "Use a decision filter: Is this aligned with my long-term direction or just urgent now?",
        "Run quarterly resets to remove misaligned commitments and protect momentum."
      ],
      advicePoints: [
        "Plan in yearly and quarterly horizons",
        "Filter opportunities through long-term alignment",
        "Cut low-conviction commitments quickly"
      ]
    },
    {
      key: "problems",
      title: "Problems & Solutions",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      reading: [
        "Your most common challenge is over-processing. Seeing too many scenarios can slow commitment.",
        "Under pressure, you tend to tighten control and carry more than necessary, increasing friction.",
        "Because you remain functional while stressed, overload can stay hidden until motivation suddenly drops.",
        "The pattern resolves through grounded structure: clear priorities, shorter loops, and practical decompression."
      ],
      readingPoints: [
        "Analysis can delay action",
        "Stress response leans toward rigidity",
        "High risk of invisible burnout",
        "Structure is your fastest stabilizer"
      ],
      advice: [
        "Use a fast decision framework: objective, top options, deadline, commit.",
        "Signal pressure early to trusted people so support starts before exhaustion.",
        "Add low-friction reset habits after high-intensity blocks to clear emotional residue."
      ],
      advicePoints: [
        "Set clear decision deadlines",
        "Ask for support earlier",
        "Practice daily decompression"
      ]
    },
    {
      key: "strengths",
      title: "Strengths & Weaknesses",
      icon: "💪",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
      reading: [
        "You are strong at pattern recognition and strategic clarity, especially in messy or uncertain situations.",
        "Your interpersonal timing is excellent. You read motive, tone, and readiness accurately.",
        "Weakness appears as over-calibration: waiting too long for perfect certainty before moving.",
        "Another growth edge is delegation. High standards can make you keep too much ownership."
      ],
      readingPoints: [
        "Advanced systems thinking",
        "Strong emotional and social judgment",
        "Can over-delay action for certainty",
        "Needs scalable delegation habits"
      ],
      advice: [
        "Turn your strengths into repeatable systems—playbooks, templates, and checklists.",
        "Practice acting at 80% clarity, then refining with real-world feedback.",
        "Delegate outcomes and success criteria, not just small tasks."
      ],
      advicePoints: [
        "Systematize what you do well",
        "Move earlier with iterative refinement",
        "Delegate for scale, not relief"
      ]
    },
    {
      key: "colors",
      title: "Lucky Colors",
      icon: "🎨",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80",
      reading: [
        "Your color profile supports emotional priming: deep blue for calm authority, green for renewal, metallic tones for precision.",
        "These palettes reinforce your natural Water-Metal balance and help you project trust and steadiness.",
        "High-heat tones like bright red/orange are powerful in moderation but can increase urgency when overused.",
        "Best results come from dark neutrals with selective accents rather than constant visual intensity."
      ],
      readingPoints: [
        "Blue supports clarity and composure",
        "Green supports recovery and growth",
        "Silver/graphite reinforces focus and authority",
        "Use hot colors as controlled accents"
      ],
      advice: [
        "For high-stakes moments, anchor your style with navy, charcoal, or deep gray plus one metallic accent.",
        "Use greens in rest spaces to improve calm and emotional reset.",
        "Apply warm colors intentionally when you need activation, not as a full-time base palette."
      ],
      advicePoints: [
        "Create a signature calm-professional palette",
        "Use restorative tones in personal spaces",
        "Trigger energy with small warm accents"
      ]
    },
    {
      key: "luck",
      title: "Luck Days & Months",
      icon: "📅",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
      reading: [
        "Your timing profile improves outcomes when important actions are scheduled in high-alignment windows.",
        "In strong periods, conversations land better, decisions feel cleaner, and execution friction is lower.",
        "Lower-energy windows are not failures; they are optimal for maintenance, cleanup, and reflection.",
        "Calendar strategy is a key strength for you: timing amplifies effort and consistency."
      ],
      readingPoints: [
        "Use strong windows for visibility and decisions",
        "Use quiet windows for maintenance and closure",
        "Timing works best when pre-planned",
        "Discipline still remains the foundation"
      ],
      advice: [
        "Batch important meetings, launches, and difficult conversations into your strongest weekly windows.",
        "Follow a monthly rhythm: plan, execute, communicate, review.",
        "Track outcomes by timing for 90 days to personalize your luck strategy with real data."
      ],
      advicePoints: [
        "Schedule impact tasks intentionally",
        "Adopt a repeatable monthly cadence",
        "Measure timing-to-outcome patterns"
      ]
    }
  ];

  const activeItem = fortuneData[activeIndex];

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

        <div className="results-split-layout">
          {/* Left Sidebar */}
          <aside className="results-sidebar">
            <div className="results-sidebar-brand">
              <span>八字</span>
            </div>
            <nav className="sidebar-nav">
              {fortuneData.map((item, index) => (
                <button
                  key={item.key}
                  className={`sidebar-item ${activeIndex === index ? "active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="sidebar-step-dot">{index + 1}</span>
                  <div className="sidebar-text">
                    <span className="sidebar-title">{item.title}</span>
                    <span className="sidebar-desc">
                      {index === 0 && "Love & relationships"}
                      {index === 1 && "Career & work"}
                      {index === 2 && "Daily habits"}
                      {index === 3 && "Future outlook"}
                      {index === 4 && "Challenges"}
                      {index === 5 && "Self awareness"}
                      {index === 6 && "Color guidance"}
                      {index === 7 && "Timing strategy"}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
            <div className="results-sidebar-footer">
              <span>← Go back</span>
              <span>Need help?</span>
            </div>
          </aside>

          {/* Right Content Panel */}
          <main className="results-content-panel">
            <div className="content-card">
              {/* Header */}
              <header className="content-header">
                <h3 className="content-title">
                  <span className="content-icon">{activeItem.icon}</span>
                  {activeItem.title}
                </h3>
                <span className="content-counter">{activeIndex + 1} of {fortuneData.length}</span>
              </header>

              {/* Image */}
              <div className="content-image-wrapper">
                <img 
                  src={activeItem.image} 
                  alt={activeItem.title}
                  className="content-image"
                />
                <div className="content-image-overlay" />
              </div>

              {/* Scrollable Content Body */}
              <div className="content-body-scrollable">
                {/* Reading Section */}
                <div className="content-section">
                  <h4 className="section-label reading-label">
                    <span className="label-dot" />
                    Reading
                  </h4>
                  <div className="section-body">
                    {activeItem.reading.map((paragraph, idx) => (
                      <p key={`reading-${idx}`} className="section-paragraph">{paragraph}</p>
                    ))}
                    <ul className="section-list">
                      {activeItem.readingPoints.map((point, idx) => (
                        <li key={`reading-point-${idx}`}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Advice Section */}
                <div className="content-section">
                  <h4 className="section-label advice-label">
                    <span className="label-dot" />
                    Advice
                  </h4>
                  <div className="section-body">
                    {activeItem.advice.map((paragraph, idx) => (
                      <p key={`advice-${idx}`} className="section-paragraph">{paragraph}</p>
                    ))}
                    <ul className="section-list">
                      {activeItem.advicePoints.map((point, idx) => (
                        <li key={`advice-point-${idx}`}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="content-nav-buttons">
                <button 
                  className="nav-btn nav-btn-secondary"
                  onClick={() => setActiveIndex(prev => prev === 0 ? fortuneData.length - 1 : prev - 1)}
                >
                  Back
                </button>
                <button 
                  className="nav-btn nav-btn-primary"
                  onClick={() => setActiveIndex(prev => prev === fortuneData.length - 1 ? 0 : prev + 1)}
                >
                  Continue
                </button>
              </div>
            </div>
          </main>
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

// Why Decode Ba Zi Section (Cosmic Theme)
function WhyDecodeBaZiSection() {
  const features = [
    {
      icon: "✦",
      title: "True Essence",
      description: "Discover your Day Master. Are you a sturdy Tree or a flickering Candle? Understanding your core element reveals your innate strengths and hidden weaknesses.",
      highlight: "Day Master"
    },
    {
      icon: "◈",
      title: "Divine Timing",
      description: "Time is cyclical. Our Luck Pillars algorithm predicts your 10-year life phases, guiding you on when to strike with boldness and when to conserve energy.",
      highlight: "Luck Pillars"
    },
    {
      icon: "◉",
      title: "Wealth Capacity",
      description: "Unlock your Wealth Potentials. Identify the specific elements and industries that vibrate at your frequency, maximizing your career and financial success.",
      highlight: "Wealth Potentials"
    }
  ];

  return (
    <section className="why-decode-section" id="why-decode">
      <div className="cosmic-bg">
        <div className="stars-container">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>
      </div>
      <div className="container">
        <div className="cosmic-header">
          <div className="cosmic-divider">
            <span></span>
            <div className="cosmic-star">✦</div>
            <span></span>
          </div>
          <div className="cosmic-badge">ANCIENT WISDOM · COSMIC RESONANCE</div>
          <h2 className="cosmic-title">Why Decode Your Ba Zi?</h2>
          <p className="cosmic-subtitle">
            Destiny is the wind; Life is the ship. Knowing the direction of the wind allows you to set your sails correctly.
          </p>
        </div>
        <div className="cosmic-cards">
          {features.map((feature, index) => (
            <div className="cosmic-card" key={index}>
              <div className="cosmic-icon-wrapper">
                <div className="cosmic-icon-diamond">
                  <span className="cosmic-icon">{feature.icon}</span>
                </div>
                <div className="cosmic-icon-glow"></div>
              </div>
              <h3 className="cosmic-card-title">{feature.title}</h3>
              <p className="cosmic-card-text">
                {feature.description.split(feature.highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="cosmic-highlight">{feature.highlight}</span>}
                  </span>
                ))}
              </p>
            </div>
          ))}
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
function CTABannerSection({ onGetStarted }) {
  const [hoveredDot, setHoveredDot] = useState(null);
  
  // Generate random dots
  const dots = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4
  }));

  return (
    <section className="cta-banner-section">
      {/* Animated Background */}
      <div className="cta-bg-animation">
        {/* Gradient overlay */}
        <div className="cta-gradient-overlay" />
        
        {/* Circle lines */}
        <div className="cta-circle cta-circle-1" />
        <div className="cta-circle cta-circle-2" />
        <div className="cta-circle cta-circle-3" />
        
        {/* Moving dots */}
        <div className="cta-dots-container">
          {dots.map((dot) => (
            <div
              key={dot.id}
              className={`cta-dot ${hoveredDot === dot.id ? 'cta-dot-hovered' : ''}`}
              style={{
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`
              }}
              onMouseEnter={() => setHoveredDot(dot.id)}
              onMouseLeave={() => setHoveredDot(null)}
            />
          ))}
        </div>
      </div>
      
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Discover Your Destiny?</h2>
          <p>Join thousands of seekers who have unlocked their life&apos;s blueprint with our AI-powered Bazi readings.</p>
          <button onClick={onGetStarted} className="cta-button">
            Get Your Free Reading
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
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
            <a href="/#hero">Home</a>
            <a href="/#features">Features</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#about">About</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Bazi Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Home Page Component
function HomePage({ onLoginClick }) {
  return (
    <div className="app">
      <Navigation onLoginClick={onLoginClick} />
      <HeroSection onGetStarted={onLoginClick} />
      <FortuneFormSection />
      <FortuneResultsSection />
      <WhyDecodeBaZiSection />
      <WhyBaziSection />
      <TestimonialsSection />
      <FAQSection />
      <CTABannerSection onGetStarted={onLoginClick} />
      <AboutSection />
      <Footer />
    </div>
  );
}

// Dashboard Page (placeholder)
function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a12 0%, #12121f 50%, #0d0d18 100%)',
      color: 'white',
      padding: '40px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Welcome to Your Dashboard</h1>
        {user && (
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '24px', 
            borderRadius: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%' }}
                />
              )}
              <div>
                <h2 style={{ margin: 0 }}>{user.name}</h2>
                <p style={{ margin: '4px 0 0 0', opacity: 0.6 }}>{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <p style={{ opacity: 0.7, marginBottom: '24px' }}>
          Your Bazi dashboard is coming soon. Here you will be able to view your saved readings, 
          track your luck cycles, and access personalized recommendations.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            to="/" 
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
              color: '#0a0a12',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: '600'
            }}
          >
            Back to Home
          </Link>
          <button 
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper component to pass props to HomePage
function HomePageWrapper() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <HomePage onLoginClick={openLogin} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        defaultMode={authMode}
      />
    </>
  );
}

// Main App with Modal
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePageWrapper />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
