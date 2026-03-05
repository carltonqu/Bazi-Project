import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
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

const currencyOptions = ["USD", "PHP", "EUR", "CNY", "SGD", "JPY"];

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("aboutMyself");
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getBirthWeekday = (birthDate) => {
    if (!birthDate) return "";
    return new Date(birthDate).toLocaleDateString("en-US", { weekday: "long" });
  };

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === "USD") {
        setRate(1);
        return;
      }

      try {
        const res = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
        const nextRate = res.data?.rates?.[currency];
        setRate(typeof nextRate === "number" ? nextRate : 1);
      } catch {
        setRate(1);
      }
    };

    fetchRate();
  }, [currency]);

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

  const formatMoney = (valueInUsd) => {
    const converted = Number(valueInUsd || 0) * rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const rows = fortune?.categories?.[activeTab] || [];
  const cashflows = useMemo(() => fortune?.report?.cashflows || [], [fortune]);

  const handleDownloadPdf = () => {
    if (!fortune) return;

    const doc = new jsPDF();
    let y = 12;
    const lineHeight = 7;
    const pageHeight = 280;

    const ensureSpace = (space = 16) => {
      if (y + space > pageHeight) {
        doc.addPage();
        y = 12;
      }
    };

    const addWrapped = (text, indent = 0) => {
      const lines = doc.splitTextToSize(text, 180 - indent);
      lines.forEach((line) => {
        ensureSpace();
        doc.text(line, 10 + indent, y);
        y += lineHeight;
      });
    };

    doc.setFontSize(16);
    doc.text("Bazi Summary Report", 10, y);
    y += 10;

    doc.setFontSize(11);
    addWrapped(`Name: ${formData.name || "N/A"}`);
    addWrapped(`Generated Currency: ${currency} (1 USD = ${rate.toFixed(4)} ${currency})`);

    ensureSpace();
    doc.setFontSize(13);
    doc.text("Overview", 10, y);
    y += lineHeight;
    doc.setFontSize(11);
    addWrapped(fortune?.report?.overview || "No overview available.");

    ensureSpace();
    doc.setFontSize(13);
    doc.text("Cashflows", 10, y);
    y += lineHeight;
    doc.setFontSize(11);
    cashflows.forEach((item, index) => {
      addWrapped(
        `${index + 1}. ${item.period} | ${item.item} | ${formatMoney(item.amountUsd)} | ${item.note || ""}`
      );
    });

    ensureSpace();
    doc.setFontSize(13);
    doc.text("Financial Actions", 10, y);
    y += lineHeight;
    doc.setFontSize(11);
    (fortune?.report?.financialActions || []).forEach((item, index) => {
      addWrapped(`${index + 1}. [${item.priority}] ${item.action}`);
      addWrapped(`Impact: ${item.impact}`, 4);
    });

    ensureSpace();
    doc.setFontSize(13);
    doc.text("Scenarios", 10, y);
    y += lineHeight;
    doc.setFontSize(11);
    (fortune?.report?.scenarios || []).forEach((item, index) => {
      addWrapped(`${index + 1}. ${item.name} (${item.probability}%)`);
      addWrapped(`Outcome: ${item.outcome}`, 4);
      addWrapped(`Next Step: ${item.nextStep}`, 4);
    });

    tabs.forEach((tab) => {
      ensureSpace();
      doc.setFontSize(13);
      doc.text(tabLabelMap[tab], 10, y);
      y += lineHeight;
      doc.setFontSize(11);
      (fortune?.categories?.[tab] || []).forEach((item, index) => {
        addWrapped(`${index + 1}. ${item.topic}`);
        addWrapped(`Reading: ${item.reading}`, 4);
        addWrapped(`Advice: ${item.advice}`, 4);
      });
    });

    doc.save(`bazi-report-${Date.now()}.pdf`);
  };

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

            <div className="actionsRow">
              <label className="currencyPicker">
                Currency
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {currencyOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="downloadBtn" onClick={handleDownloadPdf}>
                Download PDF
              </button>
            </div>

            <div className="reportCards">
              <article className="card">
                <h3>Overview</h3>
                <p>{fortune?.report?.overview || "No overview available yet."}</p>
              </article>

              <article className="card">
                <h3>Cashflows</h3>
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Item</th>
                        <th>Amount ({currency})</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashflows.map((row, idx) => (
                        <tr key={`${row.period}-${row.item}-${idx}`}>
                          <td>{row.period}</td>
                          <td>{row.item}</td>
                          <td>{formatMoney(row.amountUsd)}</td>
                          <td>{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="card">
                <h3>Financial Actions</h3>
                <ul>
                  {(fortune?.report?.financialActions || []).map((item, idx) => (
                    <li key={`${item.action}-${idx}`}>
                      <strong>[{item.priority}] {item.action}</strong>
                      <div>{item.impact}</div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="card">
                <h3>Scenarios</h3>
                <ul>
                  {(fortune?.report?.scenarios || []).map((item, idx) => (
                    <li key={`${item.name}-${idx}`}>
                      <strong>{item.name} ({item.probability}%)</strong>
                      <div>{item.outcome}</div>
                      <div><em>Next:</em> {item.nextStep}</div>
                    </li>
                  ))}
                </ul>
              </article>
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
