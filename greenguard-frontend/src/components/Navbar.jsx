import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "⬡" },
    { to: "/upload", label: "Upload", icon: "↑" },
    { to: "/history", label: "History", icon: "◷" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(5, 15, 10, 0.95)"
          : "rgba(5, 15, 10, 1)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(52, 211, 153, 0.12)",
        transition: "all 0.3s ease",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 32px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #34d399, #059669)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 0 20px rgba(52, 211, 153, 0.3)",
            }}
          >
            🌿
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            Green<span style={{ color: "#34d399" }}>Guard</span>
          </span>
          <span
            style={{
              background: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              color: "#34d399",
              fontSize: "10px",
              fontWeight: "600",
              padding: "2px 8px",
              borderRadius: "100px",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "1px",
            }}
          >
            ENV MONITOR
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navLinks.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  color: active ? "#34d399" : "rgba(255,255,255,0.6)",
                  background: active
                    ? "rgba(52, 211, 153, 0.1)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(52, 211, 153, 0.2)"
                    : "1px solid transparent",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.2px",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "12px" }}>{icon}</span>
                {label}
              </Link>
            );
          })}

          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(255,255,255,0.1)",
              margin: "0 8px",
            }}
          />

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "'Syne', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
              e.currentTarget.style.color = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "#f87171";
            }}
          >
            ⎋ Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;