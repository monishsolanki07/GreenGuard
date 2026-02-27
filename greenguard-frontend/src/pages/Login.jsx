import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "login/",
        { username, password }
      );

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const decoded = JSON.parse(atob(response.data.access.split(".")[1]));

if (decoded.role === "ADMIN") {
  navigate("/admin/dashboard");
} else {
  navigate("/company/dashboard");
}
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {/* Glow effects */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "-200px",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          right: "-200px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Left Branding Panel */}
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
            <span style={{ color: "#fff", fontSize: "26px", fontWeight: "800" }}>
              Green<span style={{ color: "#34d399" }}>Guard</span>
            </span>
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              color: "rgba(52, 211, 153, 0.6)",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Environmental Compliance Platform
          </span>
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize: "52px",
            fontWeight: "800",
            lineHeight: "1.1",
            marginBottom: "24px",
          }}
        >
          Monitor.
          <br />
          <span style={{ color: "#34d399" }}>Analyze.</span>
          <br />
          Comply.
        </h1>

        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", maxWidth: "360px" }}>
          Real-time emissions tracking and compliance monitoring for industrial facilities worldwide.
        </p>
      </div>

      {/* Right Login Panel */}
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
            border: "1px solid rgba(52, 211, 153, 0.15)",
            borderRadius: "24px",
            padding: "48px",
            backdropFilter: "blur(20px)",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
            Welcome back
          </h2>

          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "36px" }}>
            Sign in to your GreenGuard account
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
            </div>

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
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>

          {/* Signup Link */}
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            New to GreenGuard?{" "}
            <Link
              to="/signup"
              style={{
                color: "#34d399",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Create an account →
            </Link>
          </div>

          {/* Security Badge */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 8px #34d399",
              }}
            />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
              Secured with ISO 27001 compliance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;