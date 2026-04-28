import { useState, useEffect } from "react";
import { useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import "./App.css";

const initialForm = {
  name: "",
  birthDate: "",
  birthTime: "",
  birthLocation: "",
  currentAddress: "",
  jobPosition: "",
  gender: "",
  lifeProblem: "",
};

const tabs = ["aboutMyself", "career", "relationships", "business", "lifeGoals"];

const tabLabelMap = {
  aboutMyself: "About Myself",
  career: "Career",
  relationships: "Relationships",
  business: "Business",
  lifeGoals: "Life Goals",
};

const isSameForm = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const parseProbability = (value) => {
  const num = Number(String(value ?? "").replace("%", ""));
  return Number.isFinite(num) ? num : 0;
};

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
          <a href="#reading" className="nav-link">Reading</a>
          <a href="#history" className="nav-link">History</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <a href="#reading" className="nav-cta">Get Started</a>
      </div>
    </nav>
  );
}

// Hero Section Component
function HeroSection({ onGetStarted }) {
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
          <button className="hero-cta-primary" onClick={onGetStarted}>
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="hero-cta-secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
            Learn More
          </button>
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

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("aboutMyself");
  const [lastCalculatedInput, setLastCalculatedInput] = useState(null);
  const [history, setHistory] = useState([]);
  const [comparePrimaryId, setComparePrimaryId] = useState(null);
  const [compareSecondaryIds, setCompareSecondaryIds] = useState([]);

  const hasUnsavedScenarioChanges = useMemo(() => {
    if (!fortune || !lastCalculatedInput) return false;
    return !isSameForm(formData, lastCalculatedInput);
  }, [fortune, formData, lastCalculatedInput]);

  const getBirthWeekday = (birthDate) => {
    if (!birthDate) return "";
    return new Date(birthDate).toLocaleDateString("en-US", { weekday: "long" });
  };

  const scrollToReading = () => {
    document.getElementById('reading')?.scrollIntoView({ behavior: 'smooth' });
  };

  const runScenarioCalculation = async ({ mode = "generate", inputOverride = null } = {}) => {
    const inputToUse = inputOverride || formData;

    if (mode === "recalculate") {
      setIsRecalculating(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const payload = {
        ...inputToUse,
        birthWeekday: getBirthWeekday(inputToUse.birthDate),
      };

      const res = await axios.post(`${API_BASE_URL}/api/fortune`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const nextFortune = res.data;
      setFortune(nextFortune);
      setFormData(inputToUse);
      setLastCalculatedInput(inputToUse);
      setIsModalOpen(true);
      setActiveTab("aboutMyself");

      const scenarios = nextFortune?.report?.scenarios || [];
      const cashflows = nextFortune?.report?.cashflows || [];
      const totalCashflowUsd = cashflows.reduce((sum, item) => sum + Number(item?.amountUsd || 0), 0);
      const avgScenarioProbability =
        scenarios.length > 0
          ? scenarios.reduce((sum, item) => sum + parseProbability(item?.probability), 0) / scenarios.length
          : 0;

      setHistory((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          input: inputToUse,
          scenarioCount: scenarios.length,
          totalCashflowUsd,
          avgScenarioProbability,
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate fortune.");
    } finally {
      setLoading(false);
      setIsRecalculating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await runScenarioCalculation({ mode: "generate" });
  };

  const handleRecalculateCurrent = async () => {
    await runScenarioCalculation({ mode: "recalculate" });
  };

  const handleRecalculateFromHistory = async (historyItem) => {
    await runScenarioCalculation({ mode: "recalculate", inputOverride: historyItem.input });
  };

  const handleCompareCardClick = (cardId) => {
    if (!comparePrimaryId) {
      setComparePrimaryId(cardId);
      setCompareSecondaryIds([]);
      return;
    }

    if (comparePrimaryId === cardId) {
      setComparePrimaryId(null);
      setCompareSecondaryIds([]);
      return;
    }

    if (compareSecondaryIds.includes(cardId)) {
      setCompareSecondaryIds((prev) => prev.filter((id) => id !== cardId));
      return;
    }

    if (compareSecondaryIds.length < 2) {
      setCompareSecondaryIds((prev) => [...prev, cardId]);
    }
  };

  const clearCompareSelection = () => {
    setComparePrimaryId(null);
    setCompareSecondaryIds([]);
  };

  const closeModal = () => setIsModalOpen(false);

  const rows = fortune?.categories?.[activeTab] || [];

  const comparedCards = useMemo(() => {
    const selectedIds = [comparePrimaryId, ...compareSecondaryIds].filter(Boolean);
    return selectedIds
      .map((id) => history.find((item) => item.id === id))
      .filter(Boolean);
  }, [comparePrimaryId, compareSecondaryIds, history]);

  const chartMax = useMemo(() => {
    const scenarioMax = Math.max(1, ...comparedCards.map((c) => c.scenarioCount || 0));
    const probabilityMax = Math.max(1, ...comparedCards.map((c) => c.avgScenarioProbability || 0));
    const cashflowMax = Math.max(1, ...comparedCards.map((c) => c.totalCashflowUsd || 0));
    return {
      scenarioMax,
      probabilityMax,
      cashflowMax,
    };
  }, [comparedCards]);

  return (
    <div className="app">
      <Navigation />
      <HeroSection onGetStarted={scrollToReading} />

      {/* Reading Section */}
      <section className="reading-section" id="reading">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Your Journey Begins</span>
            <h2 className="section-title">Enter Your Details</h2>
            <p className="section-subtitle">Share your birth information to reveal your personalized cosmic blueprint</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <label className="form-field">
                <span className="form-label">Full Name</span>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter your name"
                  required 
                />
              </label>

              <label className="form-field">
                <span className="form-label">Birth Date</span>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={formData.birthDate} 
                  onChange={handleChange} 
                  required 
                />
              </label>

              <label className="form-field">
                <span className="form-label">Birth Time</span>
                <input 
                  type="time" 
                  name="birthTime" 
                  value={formData.birthTime} 
                  onChange={handleChange} 
                  required 
                />
              </label>

              <label className="form-field">
                <span className="form-label">Birth Location</span>
                <input 
                  name="birthLocation" 
                  value={formData.birthLocation} 
                  onChange={handleChange} 
                  placeholder="City, Country"
                  required 
                />
              </label>

              <label className="form-field">
                <span className="form-label">Current Address</span>
                <input 
                  name="currentAddress" 
                  value={formData.currentAddress} 
                  onChange={handleChange} 
                  placeholder="Where you live now"
                  required 
                />
              </label>

              <label className="form-field">
                <span className="form-label">Job Position</span>
                <input 
                  name="jobPosition" 
                  value={formData.jobPosition} 
                  onChange={handleChange} 
                  placeholder="Your current role"
                  required 
                />
              </label>

              <label className="form-field">
                <span className="form-label">Gender</span>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="prefer_not_say">Prefer not to say</option>
                </select>
              </label>
            </div>

            <label className="form-field form-field-full">
              <span className="form-label">Life Challenge</span>
              <textarea
                name="lifeProblem"
                value={formData.lifeProblem}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what you're currently facing or seeking guidance on..."
                required
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading || isRecalculating}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    Reveal My Fortune
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

              {hasUnsavedScenarioChanges && (
                <button type="button" className="btn-secondary" onClick={handleRecalculateCurrent} disabled={isRecalculating || loading}>
                  Recalculate Scenario
                </button>
              )}
            </div>

            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </section>

      {/* Results Modal */}
      {isModalOpen && fortune && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Your Fortune Reading</h2>
                <p className="modal-subtitle">Generated for {formData.name}</p>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`tab ${activeTab === tab ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabLabelMap[tab]}
                </button>
              ))}
            </div>

            <div className="compare-bar">
              <strong>Compare Scenarios</strong>
              <span>Pick 1 base card (green), then up to 2 more (yellow)</span>
              <button type="button" className="btn-text" onClick={clearCompareSelection}>
                Clear
              </button>
            </div>

            {comparedCards.length > 0 && (
              <div className="compare-panel">
                <h3>Scenario Comparison</h3>
                
                <div className="graph-block">
                  <h4>Number of Scenarios</h4>
                  {comparedCards.map((card) => (
                    <div className="graph-row" key={`scenario-${card.id}`}>
                      <span className="graph-label">{card.input.name || "Unnamed"}</span>
                      <div className="graph-track">
                        <div
                          className={`graph-bar ${comparePrimaryId === card.id ? "bar-primary" : "bar-secondary"}`}
                          style={{ width: `${((card.scenarioCount || 0) / chartMax.scenarioMax) * 100}%` }}
                        />
                      </div>
                      <span className="graph-value">{card.scenarioCount || 0}</span>
                    </div>
                  ))}
                </div>

                <div className="graph-block">
                  <h4>Average Probability (%)</h4>
                  {comparedCards.map((card) => (
                    <div className="graph-row" key={`probability-${card.id}`}>
                      <span className="graph-label">{card.input.name || "Unnamed"}</span>
                      <div className="graph-track">
                        <div
                          className={`graph-bar ${comparePrimaryId === card.id ? "bar-primary" : "bar-secondary"}`}
                          style={{ width: `${((card.avgScenarioProbability || 0) / chartMax.probabilityMax) * 100}%` }}
                        />
                      </div>
                      <span className="graph-value">{(card.avgScenarioProbability || 0).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>

                <div className="graph-block">
                  <h4>Total Cashflow (USD)</h4>
                  {comparedCards.map((card) => (
                    <div className="graph-row" key={`cashflow-${card.id}`}>
                      <span className="graph-label">{card.input.name || "Unnamed"}</span>
                      <div className="graph-track">
                        <div
                          className={`graph-bar ${comparePrimaryId === card.id ? "bar-primary" : "bar-secondary"}`}
                          style={{ width: `${((card.totalCashflowUsd || 0) / chartMax.cashflowMax) * 100}%` }}
                        />
                      </div>
                      <span className="graph-value">${Number(card.totalCashflowUsd || 0).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Reading</th>
                    <th>Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length > 0 ? (
                    rows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.topic}</td>
                        <td>{row.reading}</td>
                        <td>{row.advice}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>No insights available for this category yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="history-section" id="history">
              <h3>Scenario History</h3>
              {history.length === 0 ? (
                <p className="empty-state">No history yet.</p>
              ) : (
                <div className="history-grid">
                  {history.map((item) => (
                    <article
                      className={`history-card ${
                        comparePrimaryId === item.id
                          ? "compare-primary"
                          : compareSecondaryIds.includes(item.id)
                            ? "compare-secondary"
                            : ""
                      }`}
                      key={item.id}
                      onClick={() => handleCompareCardClick(item.id)}
                    >
                      <strong>{item.input.name || "Unnamed"}</strong>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                      <span>{item.scenarioCount} scenario(s)</span>
                      <button
                        type="button"
                        className="btn-text"
                        disabled={isRecalculating || loading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecalculateFromHistory(item);
                        }}
                      >
                        Recalculate
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isRecalculating && (
        <div className="modal-overlay" role="status" aria-live="polite">
          <div className="recalc-modal">
            <span className="spinner" />
            Recalculating scenario...
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">About Bazi</span>
            <h2 className="section-title">Ancient Wisdom</h2>
            <p className="section-subtitle">
              Bazi (八字), or "Eight Characters," is a traditional Chinese metaphysical system 
              that analyzes your destiny based on birth date and time.
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">🌙</div>
              <h3>Cosmic Blueprint</h3>
              <p>Your birth moment captures the unique energy pattern of the universe at that instant.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">⚡</div>
              <h3>Five Elements</h3>
              <p>Wood, Fire, Earth, Metal, and Water interact to reveal your personality and potential.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">🔮</div>
              <h3>Life Guidance</h3>
              <p>Understand your strengths, challenges, and optimal paths in career and relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">八字 Bazi</span>
              <p>Ancient wisdom. Modern insight.</p>
            </div>
            <div className="footer-links">
              <a href="#hero">Home</a>
              <a href="#reading">Reading</a>
              <a href="#about">About</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Bazi Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
