import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; 

function Signup() {
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("users/register/", {
        username,
        password,
        company_name: companyName,
      });
      const loginResponse = await api.post("login/", {
        username,
        password,
      });
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

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "'Syne', sans-serif",
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "8px",
    fontFamily: "'DM Mono', monospace",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050f0a",
        display: "flex",
        fontFamily: "'Syne', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-200px", left: "-200px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />

      {/* Left panel — branding */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #34d399, #059669)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                boxShadow: "0 0 30px rgba(52, 211, 153, 0.4)",
              }}
            >
              🌿
            </div>
            <span style={{ color: "#fff", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Green<span style={{ color: "#34d399" }}>Guard</span>
            </span>
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "rgba(52,211,153,0.6)", letterSpacing: "3px", textTransform: "uppercase" }}>
            Environmental Compliance Platform
          </span>
        </div>

        <h1 style={{ color: "#fff", fontSize: "48px", fontWeight: "800", lineHeight: "1.1", letterSpacing: "-2px", marginBottom: "24px" }}>
          Start your
          <br />
          <span style={{ color: "#34d399" }}>compliance</span>
          <br />
          journey.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", maxWidth: "360px", lineHeight: "1.7" }}>
          Join thousands of facilities using GreenGuard to monitor emissions and stay ahead of regulatory requirements.
        </p>

        {/* Feature highlights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "52px" }}>
          {[
            { icon: "⚡", text: "Real-time emissions monitoring" },
            { icon: "🛡️", text: "Automated compliance reporting" },
            { icon: "📊", text: "AI-powered risk scoring" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px",
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
              }}>
                {icon}
              </div>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — signup form */}
      <div
        style={{
          width: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(52,211,153,0.15)",
            borderRadius: "24px",
            padding: "48px",
            backdropFilter: "blur(20px)",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
            Create account
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "36px" }}>
            Set up your GreenGuard workspace
          </p>

          <form onSubmit={handleSignup}>

            {/* Username */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Company Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Company Name</label>
              <input
                type="text"
                placeholder="Your organization name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(52,211,153,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {/* Password strength hint */}
              {password.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", gap: "4px", alignItems: "center" }}>
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "100px",
                        background:
                          password.length >= level * 4
                            ? level === 1
                              ? "#f87171"
                              : level === 2
                              ? "#fbbf24"
                              : "#34d399"
                            : "rgba(255,255,255,0.08)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                  <span style={{
                    color: password.length < 4 ? "#f87171" : password.length < 8 ? "#fbbf24" : "#34d399",
                    fontSize: "11px",
                    fontFamily: "'DM Mono', monospace",
                    marginLeft: "6px",
                    minWidth: "32px",
                  }}>
                    {password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : "Good"}
                  </span>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  color: "#f87171",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                background: loading
                  ? "rgba(52,211,153,0.4)"
                  : "linear-gradient(135deg, #34d399, #059669)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "0.3px",
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 0 30px rgba(52,211,153,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {/* Divider + login link */}
          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
              Already have an account?{" "}
            </span>
            <Link
              to="/"
              style={{
                color: "#34d399",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>

          {/* Trust badge */}
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulse 2s infinite" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>
              Secured with ISO 27001 compliance
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}

export default Signup;