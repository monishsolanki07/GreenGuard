import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34d399", "#f87171", "#fbbf24"];

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("admin/dashboard/")
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={styles.mainContent}>
        {loading ? (
          <div style={styles.centered}>
            <div style={styles.spinner}></div>
            <p style={styles.loading}>Loading admin analytics...</p>
          </div>
        ) : !data ? (
          <div style={styles.centered}>
            <p style={styles.error}>Failed to load dashboard data.</p>
          </div>
        ) : (
          <DashboardContent data={data} />
        )}
      </div>
    </div>
  );
}

function DashboardContent({ data }) {
  const complianceData = [
    { name: "Compliant", value: data?.compliance_distribution?.compliant || 0 },
    { name: "Non-Compliant", value: data?.compliance_distribution?.non_compliant || 0 },
    { name: "Review Required", value: data?.compliance_distribution?.review_required || 0 },
  ];

  const highestThreat =
    data?.threat_level_breakdown?.length
      ? data.threat_level_breakdown.reduce((a, b) =>
          a.count > b.count ? a : b
        ).threat_level
      : "-";

  return (
    <>
      <h1 style={styles.heading}>Admin Control Center</h1>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPI title="Total Companies" value={data.total_companies} />
        <KPI title="Total Submissions" value={data.total_submissions} />
        <KPI title="Avg Risk Score" value={data.average_risk_score} />
        <KPI title="Highest Threat" value={highestThreat} />
      </div>

      {/* Charts Row */}
      <div style={styles.chartGrid}>
        {/* Pie Chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Compliance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={complianceData}
                dataKey="value"
                outerRadius={90}
                innerRadius={50}
              >
                {complianceData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Threat Level Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.threat_level_breakdown || []}>
              <XAxis dataKey="threat_level" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="count" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Monthly Submission Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.submission_volume_trend || []}>
            <XAxis dataKey="month" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#34d399"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Companies */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Top 5 Highest Risk Companies</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Avg Risk</th>
            </tr>
          </thead>
          <tbody>
            {(data.top_5_highest_risk_companies || []).map((company, idx) => (
              <tr key={idx}>
                <td>{company.submission__company__company_name}</td>
                <td style={{ color: "#f87171", fontWeight: "600" }}>
                  {company.avg_risk?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function KPI({ title, value }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiTitle}>{title}</p>
      <h2 style={styles.kpiValue}>{value ?? "-"}</h2>
    </div>
  );
}

const styles = {
  mainContent: {
    flex: 1,
    minHeight: "100vh",
    background: "#050f0a",
    padding: "40px",
    fontFamily: "'Syne', sans-serif",
    color: "#fff",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "30px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  kpiCard: {
    background: "rgba(255,255,255,0.04)",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid rgba(52,211,153,0.15)",
  },
  kpiTitle: {
    fontSize: "12px",
    opacity: 0.6,
  },
  kpiValue: {
    fontSize: "28px",
    marginTop: "8px",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid rgba(52,211,153,0.15)",
    marginBottom: "20px",
  },
  cardTitle: {
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    marginTop: "15px",
  },
  error: {
    color: "#f87171",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(52,211,153,0.2)",
    borderTop: "3px solid #34d399",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default AdminDashboard;