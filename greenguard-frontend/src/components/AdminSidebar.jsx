import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Companies", path: "/admin/companies", icon: "🏢" },
    { name: "Submissions", path: "/admin/submissions", icon: "📄" },
    { name: "High Risk", path: "/admin/high-risk", icon: "🚨" },
    { name: "Audit", path: "/admin/audit", icon: "🧠" },
    { name: "Policies", path: "/admin/policies", icon: "📜" },
  ];

  /* Lock body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="admin-mobile-toggle" onClick={() => setOpen(true)}>
        ☰
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="admin-backdrop"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-logo">
          <div className="admin-logo-icon">🌿</div>
          <div>
            <div className="admin-logo-text">
              Green<span style={{ color: "#34d399" }}>Guard</span>
            </div>
            <div className="admin-label">ADMIN PANEL</div>
          </div>
        </div>

        <div className="admin-nav">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-link ${active ? "active" : ""}`}
              >
                <span className="admin-icon">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>

        <button onClick={logout} className="admin-logout">
          🔒 Logout
        </button>
      </div>

      <style>{`
        .admin-sidebar {
          width: 260px;
          min-height: 100vh;
          background: #0b1f14;
          border-right: 1px solid rgba(52,211,153,0.15);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          font-family: 'Syne', sans-serif;
          transition: transform 0.3s ease;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .admin-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #34d399, #059669);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(52,211,153,0.4);
        }

        .admin-logo-text {
          color: #fff;
          font-weight: 800;
          font-size: 18px;
        }

        .admin-label {
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(52,211,153,0.6);
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .admin-link {
          padding: 12px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }

        .admin-link:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .admin-link.active {
          background: rgba(52,211,153,0.1);
          border-left: 3px solid #34d399;
          color: #34d399;
        }

        .admin-icon {
          margin-right: 10px;
        }

        .admin-logout {
          margin-top: auto;
          padding: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Mobile Toggle Button */
        .admin-mobile-toggle {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          font-size: 22px;
          color: #34d399;
          cursor: pointer;
          z-index: 200;
        }

        /* Backdrop */
        .admin-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 150;
        }

        /* Tablet & Mobile */
        @media (max-width: 1024px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            z-index: 200;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </>
  );
}

export default AdminSidebar;