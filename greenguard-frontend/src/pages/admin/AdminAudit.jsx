import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminAudit() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("admin/audit/")
      .then(res => setData(res.data))
      .catch(() => setData(null));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={styles.main}>
        <h1 style={styles.heading}>Audit Intelligence</h1>

        {!data ? (
          <p>Loading...</p>
        ) : (
          <>
            {data.most_violated_pollutant && (
              <div style={styles.card}>
                <h3>Most Violated Pollutant</h3>
                <p style={{ color: "#f87171", fontSize: "20px" }}>
                  {data.most_violated_pollutant.name} — {data.most_violated_pollutant.count}
                </p>
              </div>
            )}

            <div style={styles.card}>
              <h3>Total Unknown Pollutants</h3>
              <p style={{ color: "#fbbf24", fontSize: "20px" }}>
                {data.total_unknown_pollutants}
              </p>
            </div>

            <div style={styles.card}>
              <h3>Repeated Offenders</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>High Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {data.repeated_offenders.map((item, i) => (
                    <tr key={i}>
                      <td>{item.submission__company__company_name}</td>
                      <td>{item.high_cases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.card}>
              <h3>Top 5 Highest Average Risk</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.top_5_highest_average_risk_companies}>
                  <XAxis dataKey="submission__company__company_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avg_risk" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
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
  heading: { marginBottom: "20px" },
  card: {
    background: "rgba(255,255,255,0.04)",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
  },
  table: { width: "100%", borderCollapse: "collapse" },
};

export default AdminAudit;