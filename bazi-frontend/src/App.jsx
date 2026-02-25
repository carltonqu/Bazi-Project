import { useState } from "react";
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

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("aboutMyself");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBirthWeekday = (birthDate) => {
    if (!birthDate) return "";
    return new Date(birthDate).toLocaleDateString("en-US", { weekday: "long" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        birthWeekday: getBirthWeekday(formData.birthDate),
      };

      const res = await axios.post(`${API_BASE_URL}/api/fortune`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setFortune(res.data);
      setIsModalOpen(true);
      setActiveTab("aboutMyself");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to generate fortune.");
    } finally {
      setLoading(false);
    }
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

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Fortune"}
        </button>

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
          </div>
        </div>
      )}
    </div>
  );
}
