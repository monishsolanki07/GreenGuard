import { useEffect, useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return {}; }
}
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }
* { -webkit-tap-highlight-color: transparent; }

.db-root {
  min-height: 100vh;
  background: #050f0a;
  font-family: 'Syne', sans-serif;
  overflow-x: hidden;
}

/* ───────────────────────── BACKGROUND GRID ───────────────────────── */

.db-bg {
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

.db-wrap {
  width: min(1400px, 100%);
  margin: 0 auto;
  padding: clamp(20px, 4vw, 40px) clamp(16px, 4vw, 32px);
  position: relative;
  z-index: 1;
}

/* ───────────────────────── HEADER ───────────────────────── */

.db-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: clamp(28px, 5vw, 40px);
}

.db-header-right {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.db-badge {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px 18px;
  backdrop-filter: blur(6px);
}

.db-badge-green {
  background: rgba(52,211,153,0.08);
  border-color: rgba(52,211,153,0.2);
}

.db-badge-label {
  color: rgba(255,255,255,0.35);
  font-size: 11px;
  font-family: 'DM Mono', monospace;
  letter-spacing: 1px;
}

.db-badge-value {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  margin-top: 4px;
}

.db-badge-green .db-badge-value {
  color: #34d399;
  font-family: 'DM Mono', monospace;
}

/* ───────────────────────── STAT GRID ───────────────────────── */

.db-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 20px;
  margin-bottom: 28px;
}

/* ───────────────────────── TWO COLUMN AREA ───────────────────────── */

.db-two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 20px;
  margin-bottom: 28px;
}

/* ───────────────────────── INFO STRIP ───────────────────────── */

.db-info-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

/* ───────────────────────── PANELS ───────────────────────── */

.db-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(52,211,153,0.1);
  border-radius: 16px;
  padding: clamp(18px, 3vw, 28px);
  backdrop-filter: blur(6px);
}

.db-panel h3 {
  color: #fff;
  font-size: clamp(16px, 2vw, 18px);
  font-weight: 700;
}

/* ───────────────────────── QUICK ACTIONS ───────────────────────── */

.db-quick-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.db-quick-btn {
  flex: 1 1 100px;
  padding: 10px;
  background: rgba(52,211,153,0.06);
  border: 1px solid rgba(52,211,153,0.15);
  border-radius: 10px;
  color: #34d399;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.db-quick-btn:hover {
  background: rgba(52,211,153,0.12);
  transform: translateY(-2px);
}

/* ───────────────────────── GHOST GRID ───────────────────────── */

.db-ghost-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

/* ───────────────────────── UPLOAD LINK ───────────────────────── */

.db-upload-link {
  display: block;
  padding: 15px;
  background: linear-gradient(135deg, #34d399, #059669);
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 0 30px rgba(52,211,153,0.25);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.db-upload-link:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* ───────────────────────── CHECKLIST ───────────────────────── */

.db-checklist-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.db-step {
  display: flex;
  gap: 14px;
  padding: 12px;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.db-step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* ───────────────────────── TABLET BREAKPOINT ───────────────────────── */

@media (max-width: 1024px) {

  .db-stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .db-two-col {
    grid-template-columns: 1fr;
  }

}

/* ───────────────────────── MOBILE BREAKPOINT ───────────────────────── */

@media (max-width: 640px) {

  .db-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .db-header-right {
    flex-direction: row;
  }

  /* Horizontal KPI Rail */
  .db-stat-grid {
    display: flex;
    overflow-x: auto;
    gap: 14px;
    padding-bottom: 8px;
    scroll-snap-type: x mandatory;
  }

  .db-stat-grid > * {
    min-width: 260px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  .db-stat-grid::-webkit-scrollbar {
    display: none;
  }

  .db-two-col {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .db-info-strip {
    grid-template-columns: 1fr;
  }

  .db-quick-btn {
    font-size: 11px;
    padding: 8px;
  }

}

/* ───────────────────────── SMALL MOBILE ───────────────────────── */

@media (max-width: 400px) {

  .db-header-right {
    flex-direction: column;
  }

}
`;

function StatCard({ title, value, subtitle, icon, accent, empty }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${empty ? "rgba(255,255,255,0.06)" : accent + "22"}`,
        borderRadius: "16px", padding: "20px",
        position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { if (!empty) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 40px ${accent}15`; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {!empty && (
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: `radial-gradient(circle at top right, ${accent}10, transparent 70%)`, pointerEvents: "none" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", lineHeight: 1.4 }}>{title}</span>
        <span style={{ fontSize: "20px", opacity: empty ? 0.25 : 1, flexShrink: 0, marginLeft: "8px" }}>{icon}</span>
      </div>
      {empty ? (
        <>
          <div style={{ height: "28px", width: "60px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", marginBottom: "8px" }} />
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>No data yet</div>
        </>
      ) : (
        <>
          <div style={{ color: "#fff", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: "800", letterSpacing: "-1px", lineHeight: 1 }}>{value ?? "—"}</div>
          {subtitle && <div style={{ color: accent, fontSize: "12px", marginTop: "8px", fontFamily: "'DM Mono', monospace" }}>{subtitle}</div>}
        </>
      )}
    </div>
  );
}

const COLORS = ["#34d399", "#f87171", "#fbbf24"];
const CustomTooltip = ({ active, payload }) => active && payload?.length ? (
  <div style={{ background: "#0a1f14", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "10px", padding: "10px 14px", fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "#fff" }}>
    <strong>{payload[0].name}</strong>: {payload[0].value}
  </div>
) : null;

function GettingStartedChecklist({ hasSubmissions }) {
  const steps = [
    { done: true,            label: "Account created",         desc: "Your company workspace is ready" },
    { done: hasSubmissions,  label: "First report uploaded",   desc: "Upload a CSV emission report to begin" },
    { done: false,           label: "Compliance baseline set", desc: "Establish your first compliance score" },
    { done: false,           label: "Alerts configured",       desc: "Set threshold alerts for key pollutants" },
  ];
  const doneCount = steps.filter(s => s.done).length;
  return (
    <div className="db-panel">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <h3>Getting Started</h3>
        <span style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontSize: "11px", fontFamily: "'DM Mono', monospace", padding: "3px 8px", borderRadius: "6px", flexShrink: 0 }}>
          {doneCount}/{steps.length} COMPLETE
        </span>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden", marginBottom: "20px" }}>
        <div style={{ height: "100%", width: `${(doneCount / steps.length) * 100}%`, background: "linear-gradient(90deg, #34d399, #059669)", borderRadius: "100px", transition: "width 1s ease", boxShadow: "0 0 8px rgba(52,211,153,0.4)" }} />
      </div>
      <div className="db-checklist-steps">
        {steps.map(({ done, label, desc }, i) => (
          <div key={i} className="db-step" style={{ background: done ? "rgba(52,211,153,0.04)" : "transparent", border: `1px solid ${done ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)"}`, opacity: done ? 1 : 0.55 }}>
            <div className="db-step-num" style={{ background: done ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${done ? "#34d399" : "rgba(255,255,255,0.1)"}`, color: done ? "#34d399" : "rgba(255,255,255,0.2)" }}>
              {done ? "✓" : i + 1}
            </div>
            <div>
              <div style={{ color: done ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: "600" }}>{label}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "2px" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({ name: "", username: "" });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const d = parseJwt(token);
      setCompanyInfo({ username: d.username || "", name: d.company_name || "" });
    }
    api.get("submissions/dashboard/")
      .then(res => setData(res.data))
      .catch(() => setData({ total_submissions: 0, average_risk_score: null, highest_threat_level: null, recent_trend: null, compliant_count: 0, non_compliant_count: 0, review_required_count: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050f0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes db-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid rgba(52,211,153,0.2)", borderTop: "2px solid #34d399", borderRadius: "50%", animation: "db-spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const hasData = data?.total_submissions > 0;
  const total = hasData ? (data.compliant_count + data.non_compliant_count + data.review_required_count) : 0;
  const pieData = hasData ? [
    { name: "Compliant",       value: data.compliant_count       },
    { name: "Non-Compliant",   value: data.non_compliant_count   },
    { name: "Review Required", value: data.review_required_count },
  ] : [];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const display = companyInfo.name || companyInfo.username || "there";

  return (
    <div className="db-root">
      <style>{css}</style>
      <Navbar />
      <div className="db-bg" />

      <div className="db-wrap">

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
              {hasData ? "● LIVE MONITORING" : "○ AWAITING FIRST REPORT"}
            </p>
            <h1 style={{ color: "#fff", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: "800", letterSpacing: "-1px", marginBottom: "6px" }}>
              {greeting}, <span style={{ color: "#34d399" }}>{display}</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              {hasData ? "Real-time emissions and compliance overview" : "Upload your first emission report to unlock your analytics dashboard"}
            </p>
          </div>
          <div className="db-header-right">
            {companyInfo.name && (
              <div className="db-badge">
                <div className="db-badge-label">COMPANY</div>
                <div className="db-badge-value">🏢 {companyInfo.name}</div>
              </div>
            )}
            <div className="db-badge db-badge-green">
              <div className="db-badge-label">{hasData ? "LAST UPDATED" : "LOCAL TIME"}</div>
              <div className="db-badge-value">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="db-stat-grid">
          <StatCard title="Total Submissions" value={hasData ? data.total_submissions   : null} icon="📊" accent="#34d399" subtitle="All time reports" empty={!hasData} />
          <StatCard title="Avg Risk Score"    value={hasData ? data.average_risk_score  : null} icon="⚡" accent="#fbbf24" subtitle="Out of 10.0"      empty={!hasData} />
          <StatCard title="Highest Threat"    value={hasData ? data.highest_threat_level: null} icon="🔴" accent="#f87171" subtitle="Current period"   empty={!hasData} />
          <StatCard title="Recent Trend"      value={hasData ? data.recent_trend        : null} icon="📈" accent="#60a5fa" subtitle="vs last month"    empty={!hasData} />
        </div>

        {/* ── Main Content ── */}
        {hasData ? (
          <div className="db-two-col">

            {/* Donut chart */}
            <div className="db-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
                <h3>Compliance Distribution</h3>
                <span style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "6px", padding: "4px 10px", color: "#34d399", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>{total} total</span>
              </div>
              <div style={{ height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {pieData.map((item, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                    <div style={{ color: COLORS[i], fontSize: "18px", fontWeight: "800" }}>{total ? Math.round((item.value / total) * 100) : 0}%</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", fontFamily: "'DM Mono', monospace", marginTop: "2px" }}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bars */}
            <div className="db-panel">
              <h3 style={{ marginBottom: "20px" }}>Compliance Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "Compliant Facilities", value: data.compliant_count,       color: "#34d399" },
                  { label: "Non-Compliant",         value: data.non_compliant_count,   color: "#f87171" },
                  { label: "Under Review",          value: data.review_required_count, color: "#fbbf24" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{label}</span>
                      <span style={{ color: "#fff", fontWeight: "700", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
                        {value} <span style={{ color: "rgba(255,255,255,0.3)" }}>/ {total}</span>
                      </span>
                    </div>
                    <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${total ? (value / total) * 100 : 0}%`, background: color, borderRadius: "100px", boxShadow: `0 0 8px ${color}60`, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "1px", marginBottom: "12px" }}>QUICK ACTIONS</p>
                <div className="db-quick-row">
                  {["Export Report", "Set Alert", "View Logs"].map(action => (
                    <button key={action} className="db-quick-btn">{action}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="db-two-col">
            <GettingStartedChecklist hasSubmissions={false} />
            <div className="db-panel" style={{ display: "flex", flexDirection: "column" }}>
              <h3 style={{ marginBottom: "8px" }}>Your analytics await</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
                Once you upload your first emission report, this dashboard will populate with real compliance scores, risk trends, and pollutant breakdowns.
              </p>
              <div className="db-ghost-grid">
                {[{ emoji: "🥧", label: "Compliance Chart" }, { emoji: "📈", label: "Risk Trend" }, { emoji: "🔔", label: "Alerts Feed" }, { emoji: "📊", label: "Score Breakdown" }].map(({ emoji, label }) => (
                  <div key={label} style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "6px", opacity: 0.25 }}>{emoji}</div>
                    <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>{label}</div>
                  </div>
                ))}
              </div>
              <Link to="/company/upload" className="db-upload-link">
  ↑ Upload Your First Report
</Link>
            </div>
          </div>
        )}

        {/* ── Info Strip ── */}
        <div className="db-info-strip">
          {[
            { icon: "🌍", title: "Supported Standards", desc: "EU ETS · WHO Air Quality · OSHA · ISO 14001" },
            { icon: "⚡", title: "Real-time Processing",  desc: "Reports analyzed instantly via ML pipeline"  },
            { icon: "🔒", title: "Data Security",         desc: "ISO 27001 certified · End-to-end encrypted"  },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", padding: "18px" }}>
              <span style={{ fontSize: "22px", flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>{title}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", lineHeight: "1.5" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;