import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; }

  .login-root {
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

  .glow-tl {
    position: absolute; top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }

  .glow-br {
    position: absolute; bottom: -200px; right: -200px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }

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
    animation: pulse 1.2s ease-in-out infinite; flex-shrink: 0;
  }

  @keyframes pulse {
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

  .left-panel {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    padding: 80px; position: relative; z-index: 1;
  }

  .logo-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }

  .logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #34d399, #059669);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; box-shadow: 0 0 30px rgba(52,211,153,0.4); flex-shrink: 0;
  }

  .logo-name { color: #fff; font-size: 26px; font-weight: 800; }
  .logo-name span { color: #34d399; }

  .logo-sub {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: rgba(52,211,153,0.6); letter-spacing: 3px; text-transform: uppercase;
    margin-bottom: 60px;
  }

  .headline { color: #fff; font-size: 52px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
  .headline span { color: #34d399; }
  .subtext { color: rgba(255,255,255,0.45); font-size: 16px; max-width: 360px; }

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

  .field-label { color: rgba(255,255,255,0.6); font-size: 12px; display: block; margin-bottom: 8px; }

  .field-input {
    width: 100%; padding: 14px 16px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff; font-size: 15px;
    font-family: 'Syne', sans-serif; outline: none; transition: border-color 0.2s;
  }
  .field-input:focus { border-color: rgba(52,211,153,0.4); }

  .field-mb { margin-bottom: 20px; }
  .field-mb-lg { margin-bottom: 28px; }

  .error-box {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px; padding: 12px 16px; color: #f87171; font-size: 14px; margin-bottom: 20px;
  }

  .submit-btn {
    width: 100%; padding: 15px; border: none; border-radius: 12px;
    color: #fff; font-size: 16px; font-weight: 700; font-family: 'Syne', sans-serif;
    transition: opacity 0.2s, transform 0.1s;
  }
  .submit-btn:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
  .submit-btn:not(:disabled):active { transform: translateY(0); }

  .signup-row { margin-top: 20px; text-align: center; font-size: 14px; color: rgba(255,255,255,0.5); }
  .signup-row a { color: #34d399; text-decoration: none; font-weight: 600; }

  .security-badge {
    margin-top: 32px; padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 8px;
  }

  .green-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #34d399; box-shadow: 0 0 8px #34d399; flex-shrink: 0;
  }

  .badge-text { color: rgba(255,255,255,0.3); font-size: 12px; }

  .mobile-logo { display: none; align-items: center; gap: 10px; margin-bottom: 24px; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .left-panel { display: none; }
    .login-root { justify-content: center; align-items: flex-start; }
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
    .headline { font-size: 40px; }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWarming, setShowWarming] = useState(true);
  const [warmingMsg, setWarmingMsg] = useState("Backend is starting up — this may take 30–60 seconds…");
  const navigate = useNavigate();

  useEffect(() => {
    if (!showWarming) return;
    const messages = [
      "Backend is starting up — this may take 30–60 seconds…",
      "Still warming up — almost ready…",
      "Hang tight, server is booting on free tier…",
      "Nearly there — thanks for your patience!",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setWarmingMsg(messages[i]);
    }, 8000);
    return () => clearInterval(interval);
  }, [showWarming]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("login/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      const decoded = JSON.parse(atob(response.data.access.split(".")[1]));
      if (decoded.role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/company/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="login-root" style={{ paddingTop: showWarming ? "40px" : "0" }}>
        <div className="bg-grid" />
        <div className="glow-tl" />
        <div className="glow-br" />

        <div className="left-panel">
          <div style={{ marginBottom: "60px" }}>
            <div className="logo-row">
              <div className="logo-icon">🌿</div>
              <span className="logo-name">Green<span>Guard</span></span>
            </div>
            <div className="logo-sub">Environmental Compliance Platform</div>
          </div>
          <h1 className="headline">Monitor.<br /><span>Analyze.</span><br />Comply.</h1>
          <p className="subtext">Real-time emissions tracking and compliance monitoring for industrial facilities worldwide.</p>
        </div>

        <div className="right-panel">
          <div className="card">
            <div className="mobile-logo">
              <div className="logo-icon">🌿</div>
              <span className="logo-name">Green<span>Guard</span></span>
            </div>

            <h2>Welcome back</h2>
            <p className="card-sub">Sign in to your GreenGuard account</p>

            <form onSubmit={handleLogin}>
              <div className="field-mb">
                <label className="field-label">Username</label>
                <input className="field-input" type="text" value={username}
                  onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
              </div>
              <div className="field-mb-lg">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              {error && <div className="error-box">⚠ {error}</div>}
              <button type="submit" disabled={loading} className="submit-btn"
                style={{ background: loading ? "rgba(52,211,153,0.4)" : "linear-gradient(135deg, #34d399, #059669)", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Authenticating…" : "Sign In →"}
              </button>
            </form>

            <div className="signup-row">
              New to GreenGuard? <Link to="/signup">Create an account →</Link>
            </div>

            <div className="security-badge">
              <div className="green-dot" />
              <span className="badge-text">Secured with ISO 27001 compliance</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;