import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: "Policies", path: "/admin/policies",icon: "📜" },
  ];

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🌿</div>
        <div>
          <div style={styles.logoText}>
            Green<span style={{ color: "#34d399" }}>Guard</span>
          </div>
          <div style={styles.adminLabel}>ADMIN PANEL</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                background: active ? "rgba(52,211,153,0.1)" : "transparent",
                borderLeft: active ? "3px solid #34d399" : "3px solid transparent",
                color: active ? "#34d399" : "rgba(255,255,255,0.6)",
              }}
            >
              <span style={{ marginRight: "10px" }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <button onClick={logout} style={styles.logout}>
        🔒 Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#0b1f14",
    borderRight: "1px solid rgba(52,211,153,0.15)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    fontFamily: "'Syne', sans-serif",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #34d399, #059669)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 0 20px rgba(52,211,153,0.4)",
  },
  logoText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "18px",
  },
  adminLabel: {
    fontSize: "10px",
    letterSpacing: "2px",
    color: "rgba(52,211,153,0.6)",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flexGrow: 1,
  },
  link: {
    padding: "12px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease",
  },
  logout: {
    marginTop: "auto",
    padding: "10px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminSidebar;