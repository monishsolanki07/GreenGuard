import { useEffect, useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// Decode JWT to extract company_name / username
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

// ── Sub-components ────────────────────────────────────────────

function StatCard({ title, value, subtitle, icon, accent, empty }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${empty ? "rgba(255,255,255,0.06)" : accent + "22"}`,
        borderRadius: "16px", padding: "24px",
        position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
      }}
      onMouseEnter={(e) => {
        if (!empty) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 8px 40px ${accent}15`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {!empty && (
        <div style={{
          position: "absolute", top: 0, right: 0, width: "120px", height: "120px",
          background: `radial-gradient(circle at top right, ${accent}10, transparent 70%)`,
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
          {title}
        </span>
        <span style={{ fontSize: "22px", opacity: empty ? 0.25 : 1 }}>{icon}</span>
      </div>
      {empty ? (
        <>
          <div style={{ height: "32px", width: "80px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", marginBottom: "8px" }} />
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>No data yet</div>
        </>
      ) : (
        <>
          <div style={{ color: "#fff", fontSize: "34px", fontWeight: "800", letterSpacing: "-1px", lineHeight: 1 }}>
            {value ?? "—"}
          </div>
          {subtitle && (
            <div style={{ color: accent, fontSize: "12px", marginTop: "8px", fontFamily: "'DM Mono', monospace" }}>{subtitle}</div>
          )}
        </>
      )}
    </div>
  );
}

const COLORS = ["#34d399", "#f87171", "#fbbf24"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#0a1f14", border: "1px solid rgba(52,211,153,0.2)",
        borderRadius: "10px", padding: "10px 14px",
        fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "#fff",
      }}>
        <strong>{payload[0].name}</strong>: {payload[0].value}
      </div>
    );
  }
  return null;
};

function GettingStartedChecklist({ hasSubmissions }) {
  const steps = [
    { done: true,          label: "Account created",         desc: "Your company workspace is ready" },
    { done: hasSubmissions, label: "First report uploaded",   desc: "Upload a CSV emission report to begin" },
    { done: false,          label: "Compliance baseline set", desc: "Establish your first compliance score" },
    { done: false,          label: "Alerts configured",       desc: "Set threshold alerts for key pollutants" },
  ];

  const doneCount = steps.filter(s => s.done).length;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(52,211,153,0.1)",
      borderRadius: "16px", padding: "28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Getting Started</h3>
        <span style={{
          background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
          color: "#34d399", fontSize: "11px", fontFamily: "'DM Mono', monospace",
          padding: "3px 8px", borderRadius: "6px",
        }}>
          {doneCount}/{steps.length} COMPLETE
        </span>
      </div>

      <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden", marginBottom: "24px" }}>
        <div style={{
          height: "100%", width: `${(doneCount / steps.length) * 100}%`,
          background: "linear-gradient(90deg, #34d399, #059669)",
          borderRadius: "100px", transition: "width 1s ease",
          boxShadow: "0 0 8px rgba(52,211,153,0.4)",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {steps.map(({ done, label, desc }, i) => (
          <div key={i} style={{
            display: "flex", gap: "14px", alignItems: "flex-start",
            padding: "12px",
            background: done ? "rgba(52,211,153,0.04)" : "transparent",
            border: `1px solid ${done ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)"}`,
            borderRadius: "10px", opacity: done ? 1 : 0.55,
          }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
              background: done ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${done ? "#34d399" : "rgba(255,255,255,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
              color: done ? "#34d399" : "rgba(255,255,255,0.2)",
            }}>
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

// ── Main Dashboard ────────────────────────────────────────────

function Dashboard() {
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [companyInfo, setCompanyInfo] = useState({ name: "", username: "" });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = parseJwt(token);
      setCompanyInfo({
        username:    decoded.username     || "",
        name:        decoded.company_name || "",
      });
    }

    api.get("submissions/dashboard/")
      .then(res => setData(res.data))
      .catch(() => setData({
        total_submissions: 0, average_risk_score: null,
        highest_threat_level: null, recent_trend: null,
        compliant_count: 0, non_compliant_count: 0, review_required_count: 0,
      }))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050f0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid rgba(52,211,153,0.2)", borderTop: "2px solid #34d399", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const hasData   = data?.total_submissions > 0;
  const total     = hasData ? (data.compliant_count + data.non_compliant_count + data.review_required_count) : 0;
  const pieData   = hasData ? [
    { name: "Compliant",        value: data.compliant_count       },
    { name: "Non-Compliant",    value: data.non_compliant_count   },
    { name: "Review Required",  value: data.review_required_count },
  ] : [];

  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const display   = companyInfo.name || companyInfo.username || "there";

  return (
    <div style={{ minHeight: "100vh", background: "#050f0a", fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <Navbar />

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
          <div>
            <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
              {hasData ? "● LIVE MONITORING" : "○ AWAITING FIRST REPORT"}
            </p>
            <h1 style={{ color: "#fff", fontSize: "36px", fontWeight: "800", letterSpacing: "-1px", margin: "0 0 6px" }}>
              {greeting}, <span style={{ color: "#34d399" }}>{display}</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
              {hasData
                ? "Real-time emissions and compliance overview"
                : "Upload your first emission report to unlock your analytics dashboard"}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {companyInfo.name && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px", padding: "12px 18px", textAlign: "right",
              }}>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "1px" }}>COMPANY</div>
                <div style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginTop: "4px" }}>
                  🏢 {companyInfo.name}
                </div>
              </div>
            )}
            <div style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: "12px", padding: "12px 18px", textAlign: "right",
            }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "1px" }}>
                {hasData ? "LAST UPDATED" : "LOCAL TIME"}
              </div>
              <div style={{ color: "#34d399", fontSize: "14px", fontWeight: "600", marginTop: "4px", fontFamily: "'DM Mono', monospace" }}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
          <StatCard title="Total Submissions" value={hasData ? data.total_submissions : null} icon="📊" accent="#34d399" subtitle="All time reports"  empty={!hasData} />
          <StatCard title="Avg Risk Score"    value={hasData ? data.average_risk_score  : null} icon="⚡" accent="#fbbf24" subtitle="Out of 10.0"       empty={!hasData} />
          <StatCard title="Highest Threat"    value={hasData ? data.highest_threat_level: null} icon="🔴" accent="#f87171" subtitle="Current period"    empty={!hasData} />
          <StatCard title="Recent Trend"      value={hasData ? data.recent_trend        : null} icon="📈" accent="#60a5fa" subtitle="vs last month"     empty={!hasData} />
        </div>

        {/* ── Main content — branches on hasData ── */}
        {hasData ? (
          <>
            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

              {/* Donut pie */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(52,211,153,0.1)",
                borderRadius: "16px", padding: "28px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: 0 }}>Compliance Distribution</h3>
                  <span style={{
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
                    borderRadius: "6px", padding: "4px 10px", color: "#34d399",
                    fontSize: "11px", fontFamily: "'DM Mono', monospace",
                  }}>{total} total</span>
                </div>
                <div style={{ height: "260px" }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} stroke="none">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} formatter={v => (
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>{v}</span>
                      )} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                  {pieData.map((item, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ color: COLORS[i], fontSize: "20px", fontWeight: "800" }}>
                        {total ? Math.round((item.value / total) * 100) : 0}%
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance bars */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(52,211,153,0.1)",
                borderRadius: "16px", padding: "28px",
              }}>
                <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "0 0 20px" }}>Compliance Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { label: "Compliant Facilities", value: data.compliant_count,       color: "#34d399" },
                    { label: "Non-Compliant",        value: data.non_compliant_count,   color: "#f87171" },
                    { label: "Under Review",         value: data.review_required_count, color: "#fbbf24" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{label}</span>
                        <span style={{ color: "#fff", fontWeight: "700", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
                          {value} <span style={{ color: "rgba(255,255,255,0.3)" }}>/ {total}</span>
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${total ? (value / total) * 100 : 0}%`,
                          background: color, borderRadius: "100px",
                          boxShadow: `0 0 8px ${color}60`, transition: "width 1s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "1px", marginBottom: "12px" }}>QUICK ACTIONS</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["Export Report", "Set Alert", "View Logs"].map((action) => (
                      <button key={action} style={{
                        flex: 1, padding: "10px",
                        background: "rgba(52,211,153,0.06)",
                        border: "1px solid rgba(52,211,153,0.15)",
                        borderRadius: "10px", color: "#34d399",
                        fontSize: "12px", fontWeight: "600",
                        cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(52,211,153,0.12)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(52,211,153,0.06)"}
                      >{action}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── EMPTY STATE — new company ── */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <GettingStartedChecklist hasSubmissions={false} />

            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(52,211,153,0.1)",
              borderRadius: "16px", padding: "28px",
              display: "flex", flexDirection: "column",
            }}>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", margin: "0 0 8px" }}>Your analytics await</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.7", margin: "0 0 24px" }}>
                Once you upload your first emission report, this dashboard will populate with real compliance scores, risk trends, and pollutant breakdowns.
              </p>

              {/* Ghosted placeholder tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                {[
                  { emoji: "🥧", label: "Compliance Chart" },
                  { emoji: "📈", label: "Risk Trend"       },
                  { emoji: "🔔", label: "Alerts Feed"      },
                  { emoji: "📊", label: "Score Breakdown"  },
                ].map(({ emoji, label }) => (
                  <div key={label} style={{
                    padding: "18px", background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.07)",
                    borderRadius: "10px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "26px", marginBottom: "6px", opacity: 0.25 }}>{emoji}</div>
                    <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>{label}</div>
                  </div>
                ))}
              </div>

              <a href="/upload" style={{
                display: "block", padding: "15px",
                background: "linear-gradient(135deg, #34d399, #059669)",
                borderRadius: "12px", color: "#fff", fontSize: "15px",
                fontWeight: "700", textDecoration: "none", textAlign: "center",
                boxShadow: "0 0 30px rgba(52,211,153,0.25)", transition: "opacity 0.2s",
                marginTop: "auto",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                ↑ Upload Your First Report
              </a>
            </div>
          </div>
        )}

        {/* ── Always-visible info strip ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "8px" }}>
          {[
            { icon: "🌍", title: "Supported Standards", desc: "EU ETS · WHO Air Quality · OSHA · ISO 14001" },
            { icon: "⚡", title: "Real-time Processing",  desc: "Reports analyzed instantly via ML pipeline"  },
            { icon: "🔒", title: "Data Security",         desc: "ISO 27001 certified · End-to-end encrypted"  },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              display: "flex", gap: "14px", alignItems: "flex-start",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "14px", padding: "18px",
            }}>
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