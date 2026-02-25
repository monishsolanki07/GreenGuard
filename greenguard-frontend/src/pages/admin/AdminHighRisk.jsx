import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminHighRisk() {
  const [data, setData] = useState([]);
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    api.get("admin/high-risk/", {
      params: urgent ? { urgent: "true" } : { min_risk: 8 },
    })
      .then(res => setData(res.data))
      .catch(() => setData([]));
  }, [urgent]);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={styles.main}>
        <h1 style={styles.heading}>High Risk Monitor</h1>

        <button onClick={() => setUrgent(!urgent)} style={styles.button}>
          {urgent ? "Disable Urgent Mode" : "Enable Urgent Mode"}
        </button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Risk</th>
              <th>Threat</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.company_name}</td>
                <td style={{ color: "#f87171", fontWeight: "bold" }}>
                  {item.risk_score}
                </td>
                <td>{item.threat_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  heading: { marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  button: {
    marginBottom: "20px",
    padding: "8px 14px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default AdminHighRisk;