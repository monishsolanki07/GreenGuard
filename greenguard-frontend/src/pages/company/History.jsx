import { useEffect, useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }
* { -webkit-tap-highlight-color: transparent; }

.hy-root {
  min-height: 100vh;
  background: #050f0a;
  font-family: 'Syne', sans-serif;
  overflow-x: hidden;
}

/* ───────────────────────── BACKGROUND GRID ───────────────────────── */

.hy-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px);
  background-size: clamp(40px, 6vw, 60px) clamp(40px, 6vw, 60px);
}

/* ───────────────────────── CONTAINER ───────────────────────── */

.hy-wrap {
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) clamp(16px, 4vw, 32px);
  position: relative;
  z-index: 1;
}

/* ───────────────────────── TABLE WRAPPER ───────────────────────── */

.hy-table-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(52,211,153,0.15);
  border-radius: 16px;
  padding: clamp(18px, 3vw, 24px);
  backdrop-filter: blur(6px);
  overflow-x: auto; /* Important for medium screens */
}

/* ───────────────────────── TABLE ───────────────────────── */

.hy-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* ensures scroll instead of breaking */
}

.hy-table thead th {
  text-align: left;
  color: rgba(255,255,255,0.4);
  font-size: 12px;
  font-family: 'DM Mono', monospace;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 0 12px 14px 0;
}

.hy-table tbody tr {
  border-top: 1px solid rgba(255,255,255,0.05);
  transition: background 0.2s ease;
}

.hy-table tbody tr:hover {
  background: rgba(255,255,255,0.02);
}

.hy-table tbody td {
  padding: 14px 12px 14px 0;
  vertical-align: middle;
  color: rgba(255,255,255,0.85);
  font-size: 14px;
}

/* ───────────────────────── MOBILE CARDS ───────────────────────── */

.hy-cards {
  display: none;
  flex-direction: column;
  gap: 14px;
}

.hy-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hy-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}

.hy-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.hy-card-id {
  color: rgba(255,255,255,0.5);
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}

.hy-card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.hy-card-field {
  flex: 1 1 120px;
}

.hy-card-field-label {
  color: rgba(255,255,255,0.3);
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.hy-card-field-value {
  font-size: 14px;
  font-weight: 600;
  font-family: 'DM Mono', monospace;
}

/* ───────────────────────── DOWNLOAD BUTTON ───────────────────────── */

.hy-dl-btn {
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid rgba(52,211,153,0.2);
  background: rgba(52,211,153,0.08);
  color: #34d399;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.hy-dl-btn:hover:not(:disabled) {
  background: rgba(52,211,153,0.18);
  transform: translateY(-2px);
}

.hy-dl-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hy-dl-btn-full {
  width: 100%;
  text-align: center;
}

/* ───────────────────────── TABLET ───────────────────────── */

@media (max-width: 900px) {

  .hy-table thead th {
    font-size: 11px;
  }

  .hy-table tbody td {
    font-size: 13px;
  }

}

/* ───────────────────────── MOBILE ───────────────────────── */

@media (max-width: 640px) {

  .hy-table-box {
    background: transparent;
    border: none;
    padding: 0;
  }

  .hy-table {
    display: none;
  }

  .hy-cards {
    display: flex;
  }

}
`;

const statusConfig = {
  compliant:       { color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)",  label: "Compliant"     },
  non_compliant:   { color: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)",   label: "Non-Compliant" },
  review_required: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)",  label: "Under Review"  },
  default:         { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.2)",  label: "—"             },
};
const threatConfig = {
  HIGH:   { color: "#f87171", icon: "🔴" },
  MEDIUM: { color: "#fbbf24", icon: "🟡" },
  LOW:    { color: "#34d399", icon: "🟢" },
};

function StatusBadge({ status }) {
  const c = statusConfig[status] || statusConfig.default;
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
}

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    api.get("submissions/history/")
      .then(res => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateReport = async (id) => {
    try {
      setGeneratingId(id);
      const response = await api.post(`reports/generate/${id}/`, {}, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url; a.download = `compliance_report_${id}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch { alert("Report generation failed."); }
    finally { setGeneratingId(null); }
  };

  const isEmpty = !loading && history.length === 0;

  return (
    <div className="hy-root">
      <style>{css}</style>
      <Navbar />
      <div className="hy-bg" />

      <div className="hy-wrap">

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>↑ HISTORY</p>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "800", letterSpacing: "-1px", marginBottom: "8px" }}>Submission History</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>View compliance status and download analytical reports</p>
        </div>

        <div className="hy-table-box">
          {loading && <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>Loading submission history...</p>}
          {isEmpty && <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>No submissions found.</p>}

          {!loading && history.length > 0 && (
            <>
              {/* ── Desktop table ── */}
              <table className="hy-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Risk Score</th>
                    <th>Threat Level</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => {
                    const t = threatConfig[item.threat_level] || {};
                    return (
                      <tr key={item.id}>
                        <td><span style={{ fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.5)" }}>#{item.id}</span></td>
                        <td><StatusBadge status={item.status} /></td>
                        <td><span style={{ fontFamily: "'DM Mono', monospace", color: "#fbbf24", fontWeight: "700" }}>{item.risk_score}</span></td>
                        <td><span style={{ color: t.color, fontWeight: "600" }}>{t.icon} {item.threat_level}</span></td>
                        <td>
                          <button className="hy-dl-btn" onClick={() => handleGenerateReport(item.id)} disabled={generatingId === item.id}>
                            {generatingId === item.id ? "Generating…" : "⬇ Download PDF"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ── Mobile cards ── */}
              <div className="hy-cards">
                {history.map(item => {
                  const t = threatConfig[item.threat_level] || {};
                  return (
                    <div key={item.id} className="hy-card">
                      <div className="hy-card-top">
                        <span className="hy-card-id">#{item.id}</span>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="hy-card-meta">
                        <div className="hy-card-field">
                          <div className="hy-card-field-label">Risk Score</div>
                          <div className="hy-card-field-value" style={{ color: "#fbbf24" }}>{item.risk_score}</div>
                        </div>
                        <div className="hy-card-field">
                          <div className="hy-card-field-label">Threat Level</div>
                          <div className="hy-card-field-value" style={{ color: t.color }}>{t.icon} {item.threat_level}</div>
                        </div>
                      </div>
                      <button
                        className="hy-dl-btn hy-dl-btn-full"
                        onClick={() => handleGenerateReport(item.id)}
                        disabled={generatingId === item.id}
                        style={{ width: "100%" }}
                      >
                        {generatingId === item.id ? "Generating…" : "⬇ Download PDF"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;