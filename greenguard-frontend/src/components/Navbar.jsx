import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { to: "/company/dashboard", label: "Dashboard", icon: "⬡" },
    { to: "/company/upload", label: "Upload", icon: "↑" },
    { to: "/company/history", label: "History", icon: "◷" },
  ];

  return (
    <>
      {/* ───────── NAVBAR ───────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled
            ? "rgba(5,15,10,0.95)"
            : "rgba(5,15,10,1)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(52,211,153,0.12)",
          transition: "all 0.3s ease",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px",
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
                boxShadow: "0 0 20px rgba(52,211,153,0.3)",
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
          </div>

          {/* Desktop Links */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
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
                      ? "rgba(52,211,153,0.1)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(52,211,153,0.2)"
                      : "1px solid transparent",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "12px" }}>{icon}</span>
                  {label}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              style={{
                marginLeft: "12px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ⎋ Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div
            className="mobile-toggle"
            onClick={() => setMobileOpen(true)}
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: "#34d399",
            }}
          >
            ☰
          </div>
        </div>
      </nav>

      {/* ───────── BACKDROP ───────── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 120,
          }}
        />
      )}

      {/* ───────── SLIDE DRAWER ───────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : "-100%",
          height: "100vh",
          width: "260px",
          background: "#07140d",
          borderRight: "1px solid rgba(52,211,153,0.15)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          transition: "left 0.3s ease",
          zIndex: 130,
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "800", color: "#34d399" }}>
          Menu
        </div>

        {navLinks.map(({ to, label, icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                color: active ? "#34d399" : "#fff",
                background: active
                  ? "rgba(52,211,153,0.08)"
                  : "transparent",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              {icon} {label}
            </Link>
          );
        })}

        <div style={{ flexGrow: 1 }} />

        <button
          onClick={handleLogout}
          style={{
            padding: "10px",
            borderRadius: "8px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ⎋ Logout
        </button>
      </div>

      {/* ───────── RESPONSIVE RULES ───────── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none; }
        }
      `}</style>
    </>
  );
}

export default Navbar;