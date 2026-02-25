import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("admin/companies/")
      .then(res => setCompanies(res.data || []))
      .catch(() => setError("Failed to load companies."))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`admin/companies/${id}/status/`, {
        is_active: !currentStatus,
      });

      setCompanies(prev =>
        prev.map(company =>
          company.id === id
            ? { ...company, is_active: !currentStatus }
            : company
        )
      );
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={styles.main}>
        <h1 style={styles.heading}>Company Control Panel</h1>

        {loading ? (
          <div style={styles.center}>
            <div style={styles.spinner}></div>
            <p>Loading companies...</p>
          </div>
        ) : error ? (
          <div style={styles.center}>
            <p style={{ color: "#f87171" }}>{error}</p>
          </div>
        ) : companies.length === 0 ? (
          <div style={styles.center}>
            <p style={{ opacity: 0.6 }}>No companies registered yet.</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Submissions</th>
                  <th>Avg Risk</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {companies.map(company => {
                  const risk = Number(company.average_risk) || 0;

                  return (
                    <tr key={company.id} style={styles.row}>
                      <td>{company.company_name}</td>
                      <td style={{ opacity: 0.7 }}>{company.username}</td>

                      <td>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: company.is_active
                              ? "rgba(52,211,153,0.15)"
                              : "rgba(239,68,68,0.15)",
                            color: company.is_active
                              ? "#34d399"
                              : "#f87171",
                          }}
                        >
                          {company.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>{company.submission_count}</td>

                      <td
                        style={{
                          fontWeight: "700",
                          color:
                            risk > 7
                              ? "#f87171"
                              : risk > 4
                              ? "#fbbf24"
                              : "#34d399",
                        }}
                      >
                        {risk.toFixed(2)}
                      </td>

                      <td>
                        <button
                          style={{
                            ...styles.actionBtn,
                            background: company.is_active
                              ? "rgba(239,68,68,0.1)"
                              : "rgba(52,211,153,0.1)",
                            color: company.is_active
                              ? "#f87171"
                              : "#34d399",
                            border: `1px solid ${
                              company.is_active
                                ? "rgba(239,68,68,0.3)"
                                : "rgba(52,211,153,0.3)"
                            }`,
                          }}
                          onClick={() =>
                            toggleStatus(company.id, company.is_active)
                          }
                        >
                          {company.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  main: {
    flex: 1,
    minHeight: "100vh",
    background: "#050f0a",
    padding: "40px",
    fontFamily: "'Syne', sans-serif",
    color: "#fff",
  },
  heading: {
    fontSize: "30px",
    marginBottom: "30px",
  },
  tableWrapper: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(52,211,153,0.15)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  row: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(52,211,153,0.2)",
    borderTop: "3px solid #34d399",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginBottom: "12px",
  },
};

export default AdminCompanies;