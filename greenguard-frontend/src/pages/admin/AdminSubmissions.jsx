import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState("");
  const [threat, setThreat] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("admin/submissions/", {
        params: {
          status: status || undefined,
          threat_level: threat || undefined,
          ordering,
        },
      });

      // 🔥 HANDLE PAGINATION SAFELY
      const results = response.data.results || response.data || [];
      setSubmissions(results);
    } catch (err) {
      setError("Failed to load submissions.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, threat, ordering]);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={styles.main}>
        <h1 style={styles.heading}>All Submissions</h1>

        {/* Filters */}
        <div style={styles.filters}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">All Status</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
            <option value="REVIEW_REQUIRED">Review Required</option>
          </select>

          <select
            value={threat}
            onChange={(e) => setThreat(e.target.value)}
            style={styles.select}
          >
            <option value="">All Threat Levels</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            style={styles.select}
          >
            <option value="-created_at">Newest</option>
            <option value="risk_score">Risk Asc</option>
            <option value="-risk_score">Risk Desc</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : error ? (
          <div style={{ ...styles.center, color: "#f87171" }}>{error}</div>
        ) : submissions.length === 0 ? (
          <div style={styles.center}>No submissions found.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Risk</th>
                  <th>Threat</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((item) => {
                  const risk = Number(item.risk_score) || 0;

                  return (
                    <tr key={item.id} style={styles.row}>
                      <td>{item.id}</td>
                      <td>{item.company_name}</td>
                      <td>{item.status}</td>

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

                      <td>{item.threat_level}</td>

                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "-"}
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
    padding: "40px",
    background: "#050f0a",
    color: "#fff",
  },
  heading: {
    marginBottom: "20px",
  },
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    background: "#0b1f14",
    color: "#fff",
    border: "1px solid rgba(52,211,153,0.3)",
  },
  tableWrapper: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
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
  center: {
    padding: "40px",
  },
};

export default AdminSubmissions;