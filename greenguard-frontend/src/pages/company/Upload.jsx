import { useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .up-root { min-height: 100vh; background: #050f0a; font-family: 'Syne', sans-serif; }
  .up-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .up-wrap { max-width: 1200px; margin: 0 auto; padding: 40px 32px; position: relative; z-index: 1; }

  /* ── Layout: main + sidebar ── */
  .up-layout {
    display: grid;
    /* sidebar fixed 360px, main takes rest */
    grid-template-columns: 1fr 360px;
    grid-template-areas: "main sidebar";
    gap: 24px;
    align-items: start;
  }
  .up-main   { grid-area: main; }
  .up-sidebar { grid-area: sidebar; display: flex; flex-direction: column; gap: 16px; }

  /* ── Drop zone ── */
  .up-dropzone {
    border-radius: 20px; text-align: center;
    padding: 56px 32px; cursor: pointer;
    transition: all 0.2s ease; margin-bottom: 20px;
  }

  /* ── Submit button ── */
  .up-submit {
    width: 100%; padding: 16px; border: none; border-radius: 14px;
    color: #fff; font-size: 16px; font-weight: 700; font-family: 'Syne', sans-serif;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
  }

  /* ── Panel ── */
  .up-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(52,211,153,0.1);
    border-radius: 16px; padding: 24px;
  }
  .up-panel h3 { color: #fff; font-size: 16px; font-weight: 700; margin: 0 0 16px; }

  /* ── Result grid: 3 cols ── */
  .up-result-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }

  @keyframes up-spin { to { transform: rotate(360deg); } }
  .up-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    animation: up-spin 0.8s linear infinite; flex-shrink: 0;
  }

  /* ══════════════════════════════
     TABLET ≤ 900px
     Sidebar slides below main
  ══════════════════════════════ */
  @media (max-width: 900px) {
    .up-layout {
      grid-template-columns: 1fr;
      grid-template-areas:
        "main"
        "sidebar";
    }
    .up-sidebar { flex-direction: row; flex-wrap: wrap; }
    .up-sidebar > * { flex: 1 1 280px; }
  }

  /* ══════════════════════════════
     MOBILE ≤ 640px
  ══════════════════════════════ */
  @media (max-width: 640px) {
    .up-wrap { padding: 20px 16px; }
    .up-dropzone { padding: 40px 20px; }
    .up-result-grid { grid-template-columns: 1fr; }
    .up-sidebar { flex-direction: column; }
    .up-sidebar > * { flex: unset; }
    .up-panel { padding: 20px 16px; }
  }
`;

const guidelines = [
  { icon: "📋", title: "CSV Format Required",  desc: "Only .csv files are accepted for emission reports" },
  { icon: "📊", title: "Required Columns",     desc: "pollutant, value, unit, timestamp, facility_id"   },
  { icon: "⚖️", title: "Limits Checked",       desc: "CO₂, NOₓ, SO₂, PM2.5, and VOC thresholds applied" },
  { icon: "🔒", title: "Data Encrypted",       desc: "All submissions are encrypted at rest and in transit" },
];

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("files", file);
    try {
      setLoading(true);
      const res = await api.post("submissions/upload/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data); setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed"); setResult(null);
    } finally { setLoading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith(".csv")) setFile(f);
  };

  const threatColor = (lvl) => {
    const l = (lvl || "").toUpperCase();
    if (l === "HIGH") return "#f87171";
    if (l === "MEDIUM") return "#fbbf24";
    return "#34d399";
  };

  return (
    <div className="up-root">
      <style>{css}</style>
      <Navbar />
      <div className="up-bg" />

      <div className="up-wrap">

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#34d399", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>↑ SUBMISSION</p>
          <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "800", letterSpacing: "-1px", marginBottom: "8px" }}>Upload Emission Report</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Submit your CSV data for automated compliance analysis and risk scoring</p>
        </div>

        <div className="up-layout">

          {/* ── Main Column ── */}
          <div className="up-main">

            {/* Drop zone */}
            <div
              className="up-dropzone"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("up-file").click()}
              style={{
                border: `2px dashed ${dragOver ? "#34d399" : file ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                background: dragOver ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>{file ? "✅" : "📁"}</div>
              {file ? (
                <>
                  <p style={{ color: "#34d399", fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>{file.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontFamily: "'DM Mono', monospace", marginBottom: "16px" }}>
                    {(file.size / 1024).toFixed(1)} KB · Ready to upload
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null); setResult(null); setError(null); }}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <p style={{ color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Drop your CSV file here</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "20px" }}>or click to browse files</p>
                  <span style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>
                    .CSV files only
                  </span>
                </>
              )}
              <input id="up-file" type="file" accept=".csv" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setResult(null); setError(null); }} />
            </div>

            {/* Submit */}
            <button
              className="up-submit"
              onClick={handleUpload}
              disabled={loading || !file}
              style={{
                background: loading || !file ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #34d399, #059669)",
                color: loading || !file ? "rgba(255,255,255,0.4)" : "#fff",
                cursor: loading || !file ? "not-allowed" : "pointer",
                boxShadow: loading || !file ? "none" : "0 0 30px rgba(52,211,153,0.25)",
              }}
            >
              {loading ? (<><div className="up-spinner" /> Analyzing emissions…</>) : "↑ Submit Report for Analysis"}
            </button>

            {/* Error */}
            {error && (
              <div style={{ marginTop: "20px", padding: "16px 20px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#f87171", fontSize: "14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>⚠</span> <span><strong>Error:</strong> {error}</span>
              </div>
            )}

            {/* Result */}
            {result && (
              <div style={{ marginTop: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <span style={{ fontSize: "24px" }}>📊</span>
                  <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: 0 }}>Analysis Complete</h3>
                </div>

                <div className="up-result-grid">
                  {[
                    { label: "Status",       value: result.status,       color: result.status === "compliant" ? "#34d399" : "#f87171" },
                    { label: "Risk Score",   value: result.risk_score,   color: "#fbbf24" },
                    { label: "Threat Level", value: result.threat_level, color: threatColor(result.threat_level) },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}22`, borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "1px", marginBottom: "8px" }}>{label.toUpperCase()}</div>
                      <div style={{ color, fontSize: "20px", fontWeight: "800", textTransform: "uppercase" }}>{value}</div>
                    </div>
                  ))}
                </div>

                <h4 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "14px" }}>Violations Detected</h4>
                {result.violations.length === 0 ? (
                  <div style={{ padding: "16px", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "10px", color: "#34d399", fontSize: "14px", textAlign: "center" }}>
                    ✓ No violations found — report is compliant
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {result.violations.map((v, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderLeft: "3px solid #f87171", borderRadius: "10px" }}>
                        <div>
                          <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{v.pollutant}</span>
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginLeft: "8px" }}>{v.severity}</span>
                        </div>
                        <span style={{ color: "#f87171", fontFamily: "'DM Mono', monospace", fontSize: "13px", fontWeight: "600" }}>+{v.excess_percentage}% above limit</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="up-sidebar">

            {/* Guidelines */}
            <div className="up-panel">
              <h3>Submission Guidelines</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {guidelines.map(({ icon, title, desc }) => (
                  <div key={title} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                    <div>
                      <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600", marginBottom: "3px" }}>{title}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", lineHeight: "1.5" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limits */}
            <div className="up-panel">
              <h3>Regulatory Limits</h3>
              {[
                { name: "CO₂",   limit: "500 ppm",   standard: "EU ETS"  },
                { name: "NOₓ",   limit: "200 µg/m³", standard: "WHO Std" },
                { name: "SO₂",   limit: "125 µg/m³", standard: "EU Dir"  },
                { name: "PM2.5", limit: "15 µg/m³",  standard: "WHO Std" },
                { name: "VOC",   limit: "50 mg/m³",  standard: "OSHA"    },
              ].map(({ name, limit, standard }) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{name}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginLeft: "8px", fontFamily: "'DM Mono', monospace" }}>{standard}</span>
                  </div>
                  <span style={{ color: "#34d399", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>{limit}</span>
                </div>
              ))}
            </div>

            {/* Instant badge */}
            <div style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "16px", padding: "20px" }}>
              <div style={{ color: "#34d399", fontSize: "12px", fontWeight: "700", fontFamily: "'DM Mono', monospace", letterSpacing: "1px", marginBottom: "8px" }}>⚡ INSTANT ANALYSIS</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                Reports are processed in real-time using our ML compliance engine. Results typically returned in under 3 seconds.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Upload;