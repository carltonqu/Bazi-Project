import { useMemo, useState } from "react";
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

      setHistory((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          input: inputToUse,
          scenarioCount: nextFortune?.report?.scenarios?.length || 0,
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

  return (
    <div className="container">
      <h1>Bazi Fortune Teller</h1>
      <p className="subtitle">Enter details to generate your personalized reading.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Birth Date
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </label>

        <label>
          Birth Time
          <input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} required />
        </label>

        <label>
          Birth Location
          <input name="birthLocation" value={formData.birthLocation} onChange={handleChange} required />
        </label>

        <label>
          Current Address
          <input name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />
        </label>

        <label>
          Job Position
          <input name="jobPosition" value={formData.jobPosition} onChange={handleChange} required />
        </label>

        <label>
          Gender
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non_binary">Non-binary</option>
            <option value="prefer_not_say">Prefer not to say</option>
          </select>
        </label>

        <label>
          Life Problem
          <textarea
            name="lifeProblem"
            value={formData.lifeProblem}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your current challenge..."
            required
          />
        </label>

        <button type="submit" disabled={loading || isRecalculating}>
          {loading ? "Generating..." : "Generate Fortune"}
        </button>

        {hasUnsavedScenarioChanges && (
          <button type="button" className="secondaryBtn" onClick={handleRecalculateCurrent} disabled={isRecalculating || loading}>
            Recalculate Scenario
          </button>
        )}

        {error && <p className="error">{error}</p>}
      </form>

      {isModalOpen && fortune && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modalHeader">
              <h2>Your Fortune Reading</h2>
              <button className="closeBtn" onClick={closeModal} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={activeTab === tab ? "tab active" : "tab"}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabLabelMap[tab]}
                </button>
              ))}
            </div>

            <div className="compareBar">
              <strong>Compare Scenarios</strong>
              <span>
                Pick 1 base card (green), then pick up to 2 more cards (yellow).
              </span>
              <button type="button" className="secondaryBtn" onClick={clearCompareSelection}>
                Clear Selection
              </button>
            </div>

            <div className="tableWrap">
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

            <div className="historySection">
              <h3>Scenario History</h3>
              {history.length === 0 ? (
                <p className="subtitle">No history yet.</p>
              ) : (
                <div className="historyGrid">
                  {history.map((item) => (
                    <article
                      className={`historyCard ${
                        comparePrimaryId === item.id
                          ? "comparePrimary"
                          : compareSecondaryIds.includes(item.id)
                            ? "compareSecondary"
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
                        className="secondaryBtn"
                        disabled={isRecalculating || loading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecalculateFromHistory(item);
                        }}
                      >
                        Recalculate Scenario
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
        <div className="modalOverlay" role="status" aria-live="polite">
          <div className="recalcModal">Recalculating scenario...</div>
        </div>
      )}
    </div>
  );
}
