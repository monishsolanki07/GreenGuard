import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

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
    <span style={{
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.color,
      padding: "4px 12px",
      borderRadius: "100px",
      fontSize: "12px",
      fontWeight: "600",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.3px",
    }}>
      {cfg.label || status}
    </span>
  );
}

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("submissions/history/");
        setHistory(response.data);
      } catch (error) {
        // Demo fallback
        setHistory([
          { id: "S-1024", status: "compliant", risk_score: 3.2, threat_level: "LOW", created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: "S-1023", status: "non_compliant", risk_score: 8.7, threat_level: "HIGH", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
          { id: "S-1022", status: "review_required", risk_score: 5.1, threat_level: "MEDIUM", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
          { id: "S-1021", status: "compliant", risk_score: 2.8, threat_level: "LOW", created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
          { id: "S-1020", status: "non_compliant", risk_score: 9.1, threat_level: "HIGH", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
          { id: "S-1019", status: "compliant", risk_score: 1.4, threat_level: "LOW", created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = history.filter((item) => {
    const matchFilter = filter === "all" || item.status === filter;
    const matchSearch = search === "" || String(item.id).toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: history.length,
    compliant: history.filter(h => h.status === "compliant").length,
    nonCompliant: history.filter(h => h.status === "non_compliant").length,
    avgRisk: history.length ? (history.reduce((s, h) => s + (Number(h.risk_score) || 0), 0) / history.length).toFixed(1) : "—",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050f0a", fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <Navbar />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
              ◷ HISTORY
            </p>
            <h1 style={{ color: "#fff", fontSize: "36px", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 8px" }}>
              Submission History
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              Review all past emission reports and compliance results
            </p>
          </div>
          <button style={{
            padding: "12px 20px",
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: "12px",
            color: "#34d399",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
          }}>
            ↓ Export CSV
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Submissions", value: stats.total, color: "#60a5fa" },
            { label: "Compliant", value: stats.compliant, color: "#34d399" },
            { label: "Non-Compliant", value: stats.nonCompliant, color: "#f87171" },
            { label: "Avg Risk Score", value: stats.avgRisk, color: "#fbbf24" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${color}20`,
              borderRadius: "14px",
              padding: "20px",
            }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "1px", marginBottom: "8px" }}>{label.toUpperCase()}</div>
              <div style={{ color, fontSize: "28px", fontWeight: "800" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Table container */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(52,211,153,0.1)",
          borderRadius: "20px",
          overflow: "hidden",
        }}>
          {/* Table toolbar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            gap: "16px",
            flexWrap: "wrap",
          }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search by ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "10px 16px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'DM Mono', monospace",
                width: "220px",
              }}
            />

            {/* Filter pills */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["all", "compliant", "non_compliant", "review_required"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: filter === f ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    background: filter === f ? "rgba(52,211,153,0.1)" : "transparent",
                    color: filter === f ? "#34d399" : "rgba(255,255,255,0.4)",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    transition: "all 0.15s",
                    textTransform: "capitalize",
                  }}
                >
                  {f === "all" ? "All" : f === "non_compliant" ? "Non-Compliant" : f === "review_required" ? "Under Review" : "Compliant"}
                </button>
              ))}
            </div>

            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>
              {filtered.length} records
            </span>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: "80px", textAlign: "center" }}>
              <div style={{ width: "36px", height: "36px", border: "2px solid rgba(52,211,153,0.2)", borderTop: "2px solid #34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>Loading history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "80px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>No submissions found</p>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Submission ID", "Status", "Risk Score", "Threat Level", "Submitted"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 24px",
                      textAlign: "left",
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "1px",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const threat = threatConfig[item.threat_level?.toUpperCase()] || { color: "#60a5fa", icon: "⚪" };
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.15s",
                        cursor: "pointer",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "14px", fontWeight: "600" }}>
                          #{item.id}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            height: "4px",
                            width: "60px",
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "100px",
                            overflow: "hidden",
                          }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.min((Number(item.risk_score) / 10) * 100, 100)}%`,
                              background: Number(item.risk_score) > 7 ? "#f87171" : Number(item.risk_score) > 4 ? "#fbbf24" : "#34d399",
                              borderRadius: "100px",
                            }} />
                          </div>
                          <span style={{ color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "14px" }}>
                            {item.risk_score}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ color: threat.color, fontFamily: "'DM Mono', monospace", fontSize: "13px", fontWeight: "600" }}>
                          {threat.icon} {item.threat_level || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div>
                          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>
                            {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(255,255,255,0.2); }`}</style>
    </div>
  );
}

export default History;