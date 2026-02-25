import { useEffect, useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";

const statusConfig = {
  compliant: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", label: "Compliant" },
  non_compliant: { color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "Non-Compliant" },
  review_required: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)", label: "Under Review" },
  default: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", label: "—" },
};

const threatConfig = {
  HIGH: { color: "#f87171", icon: "🔴" },
  MEDIUM: { color: "#fbbf24", icon: "🟡" },
  LOW: { color: "#34d399", icon: "🟢" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.default;
  return (
    <span
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        padding: "4px 12px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {cfg.label}
    </span>
  );
}

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("submissions/history/");
        setHistory(response.data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleGenerateReport = async (id) => {
    try {
      setGeneratingId(id);
      const response = await api.post(
        `reports/generate/${id}/`,
        {},
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `compliance_report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Report generation failed.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050f0a", fontFamily: "'Syne', sans-serif" }}>
      <Navbar />

      {/* subtle grid background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              color: "#34d399",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            ↑ HISTORY
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-1px",
              margin: "0 0 8px",
            }}
          >
            Submission History
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            View compliance status and download analytical reports
          </p>
        </div>

        {/* Table Container */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(52,211,153,0.15)",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>
              Loading submission history...
            </p>
          ) : history.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.4)" }}>
              No submissions found.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th>Threat</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => {
                  const threat = threatConfig[item.threat_level] || {};
                  return (
                    <tr key={item.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "14px 0" }}>{item.id}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td>{item.risk_score}</td>
                      <td style={{ color: threat.color }}>
                        {threat.icon} {item.threat_level}
                      </td>
                      <td>
                        <button
                          onClick={() => handleGenerateReport(item.id)}
                          disabled={generatingId === item.id}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "1px solid rgba(52,211,153,0.2)",
                            background: "rgba(52,211,153,0.08)",
                            color: "#34d399",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          {generatingId === item.id ? "Generating..." : "Download PDF"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;