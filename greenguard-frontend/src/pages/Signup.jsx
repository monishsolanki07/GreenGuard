import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }

  .signup-root {
    min-height: 100vh;
    background: #050f0a;
    display: flex;
    font-family: 'Syne', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .bg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .glow-tr {
    position: absolute; top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }

  .glow-bl {
    position: absolute; bottom: -200px; left: -200px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }

  /* Warming banner */
  .warming-banner {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(52,211,153,0.1);
    border-bottom: 1px solid rgba(52,211,153,0.25);
    backdrop-filter: blur(12px);
    padding: 10px 20px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    animation: slideDown 0.4s ease;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .warming-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #34d399;
    animation: wdpulse 1.2s ease-in-out infinite; flex-shrink: 0;
  }

  @keyframes wdpulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
    50% { opacity: 0.7; transform: scale(0.9); box-shadow: 0 0 0 6px rgba(52,211,153,0); }
  }

  .warming-text {
    color: rgba(52,211,153,0.9);
    font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.5px;
  }

  .warming-dismiss {
    margin-left: 12px; background: none; border: none;
    color: rgba(52,211,153,0.5); cursor: pointer; font-size: 18px; line-height: 1;
    padding: 0 4px; transition: color 0.2s;
  }
  .warming-dismiss:hover { color: rgba(52,211,153,0.9); }

  /* Left panel */
  .left-panel {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 80px; position: relative; z-index: 1;
  }

  .logo-wrap { margin-bottom: 60px; }
  .logo-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }

  .logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #34d399, #059669);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; box-shadow: 0 0 30px rgba(52,211,153,0.4); flex-shrink: 0;
  }

  .logo-name { color: #fff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .logo-name span { color: #34d399; }

  .logo-sub {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: rgba(52,211,153,0.6); letter-spacing: 3px; text-transform: uppercase;
  }

  .headline {
    color: #fff; font-size: 48px; font-weight: 800;
    line-height: 1.1; letter-spacing: -2px; margin-bottom: 24px;
  }
  .headline span { color: #34d399; }

  .subtext { color: rgba(255,255,255,0.4); font-size: 16px; max-width: 360px; line-height: 1.7; }

  .features { display: flex; flex-direction: column; gap: 16px; margin-top: 52px; }

  .feature-item { display: flex; align-items: center; gap: 12px; }

  .feature-icon {
    width: 32px; height: 32px;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  .feature-text { color: rgba(255,255,255,0.55); font-size: 14px; }

  /* Right panel */
  .right-panel {
    width: 480px; display: flex; align-items: center; justify-content: center;
    padding: 40px; position: relative; z-index: 1;
  }

  .card {
    width: 100%; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(52,211,153,0.15); border-radius: 24px;
    padding: 48px; backdrop-filter: blur(20px);
  }

  .card h2 { color: #fff; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .card-sub { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 36px; }

  .field-label {
    display: block; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;
    font-family: 'DM Mono', monospace;
  }

  .field-input {
    width: 100%; padding: 14px 16px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff; font-size: 15px;
    font-family: 'Syne', sans-serif; outline: none; transition: border-color 0.2s;
  }
  .field-input:focus { border-color: rgba(52,211,153,0.5); }
  .field-input::placeholder { color: rgba(255,255,255,0.25); }

  .field-mb { margin-bottom: 20px; }
  .field-mb-lg { margin-bottom: 28px; }

  .strength-bar { margin-top: 8px; display: flex; gap: 4px; align-items: center; }
  .strength-segment { flex: 1; height: 3px; border-radius: 100px; transition: background 0.3s; }
  .strength-label { font-size: 11px; font-family: 'DM Mono', monospace; margin-left: 6px; min-width: 32px; }

  .error-box {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 14px; margin-bottom: 20px;
  }

  .submit-btn {
    width: 100%; padding: 15px; border: none; border-radius: 12px;
    color: #fff; font-size: 15px; font-weight: 700; font-family: 'Syne', sans-serif;
    letter-spacing: 0.3px; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .submit-btn:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
  .submit-btn:not(:disabled):active { transform: translateY(0); }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .divider-row {
    margin-top: 28px; padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: center;
  }
  .divider-row span { color: rgba(255,255,255,0.3); font-size: 14px; }
  .divider-row a { color: #34d399; font-size: 14px; font-weight: 600; text-decoration: none; }

  .trust-badge {
    margin-top: 20px; display: flex; align-items: center;
    justify-content: center; gap: 8px;
  }

  .green-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 8px #34d399;
    animation: dotpulse 2s infinite; flex-shrink: 0;
  }

  .badge-text { color: rgba(255,255,255,0.3); font-size: 12px; font-family: 'DM Mono', monospace; }

  /* Mobile logo — hidden on desktop */
  .mobile-logo { display: none; align-items: center; gap: 10px; margin-bottom: 24px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes dotpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .left-panel { display: none; }
    .signup-root { justify-content: center; align-items: flex-start; }
    .right-panel {
      width: 100%; max-width: 480px;
      padding: 24px 16px; padding-top: 60px;
      align-items: flex-start;
    }
    .card { padding: 32px 24px; }
    .mobile-logo { display: flex; }
  }

  @media (max-width: 400px) {
    .card { padding: 28px 18px; border-radius: 18px; }
    .card h2 { font-size: 20px; }
  }
`;

const WARMING_MESSAGES = [
  "Backend is starting up — this may take 30–60 seconds…",
  "Still warming up — almost ready…",
  "Hang tight, server is booting on free tier…",
  "Nearly there — thanks for your patience!",
];

function Signup() {
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWarming, setShowWarming] = useState(true);
  const [warmingMsg, setWarmingMsg] = useState(WARMING_MESSAGES[0]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showWarming) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % WARMING_MESSAGES.length;
      setWarmingMsg(WARMING_MESSAGES[i]);
    }, 8000);
    return () => clearInterval(interval);
  }, [showWarming]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("users/register/", { username, password, company_name: companyName });
      const loginResponse = await api.post("login/", { username, password });
      localStorage.setItem("access_token", loginResponse.data.access);
      localStorage.setItem("refresh_token", loginResponse.data.refresh);
      navigate("/company/dashboard");
    } catch (err) {
      if (err.response?.data?.username) {
        setError("Username already exists.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = password.length < 4 ? "#f87171" : password.length < 8 ? "#fbbf24" : "#34d399";
  const strengthLabel = password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : "Good";

  return (
    <>
      <style>{styles}</style>

      {showWarming && (
        <div className="warming-banner">
          <div className="warming-dot" />
          <span className="warming-text">{warmingMsg}</span>
          <button className="warming-dismiss" onClick={() => setShowWarming(false)}>×</button>
        </div>
      )}

      <div className="signup-root" style={{ paddingTop: showWarming ? "40px" : "0" }}>
        <div className="bg-grid" />
        <div className="glow-tr" />
        <div className="glow-bl" />

        {/* Left branding panel — desktop only */}
        <div className="left-panel">
          <div className="logo-wrap">
            <div className="logo-row">
              <div className="logo-icon">🌿</div>
              <span className="logo-name">Green<span>Guard</span></span>
            </div>
            <div className="logo-sub">Environmental Compliance Platform</div>
          </div>

          <h1 className="headline">
            Start your<br />
            <span>compliance</span><br />
            journey.
          </h1>
          <p className="subtext">
            Join thousands of facilities using GreenGuard to monitor emissions and stay ahead of regulatory requirements.
          </p>

          <div className="features">
            {[
              { icon: "⚡", text: "Real-time emissions monitoring" },
              { icon: "🛡️", text: "Automated compliance reporting" },
              { icon: "📊", text: "AI-powered risk scoring" },
            ].map(({ icon, text }) => (
              <div key={text} className="feature-item">
                <div className="feature-icon">{icon}</div>
                <span className="feature-text">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="right-panel">
          <div className="card">
            {/* Mobile logo */}
            <div className="mobile-logo">
              <div className="logo-icon">🌿</div>
              <span className="logo-name">Green<span>Guard</span></span>
            </div>

            <h2>Create account</h2>
            <p className="card-sub">Set up your GreenGuard workspace</p>

            <form onSubmit={handleSignup}>
              <div className="field-mb">
                <label className="field-label">Username</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="field-mb">
                <label className="field-label">Company Name</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Your organization name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  autoComplete="organization"
                />
              </div>

              <div className="field-mb-lg">
                <label className="field-label">Password</label>
                <input
                  className="field-input"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {password.length > 0 && (
                  <div className="strength-bar">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="strength-segment"
                        style={{
                          background: password.length >= level * 4 ? strengthColor : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                    <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              {error && <div className="error-box">⚠ {error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                style={{
                  background: loading ? "rgba(52,211,153,0.4)" : "linear-gradient(135deg, #34d399, #059669)",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 0 30px rgba(52,211,153,0.25)",
                }}
              >
                {loading ? (
                  <><div className="spinner" /> Creating Account...</>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <div className="divider-row">
              <span>Already have an account? </span>
              <Link to="/">Sign in</Link>
            </div>

            <div className="trust-badge">
              <div className="green-dot" />
              <span className="badge-text">Secured with ISO 27001 compliance</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;