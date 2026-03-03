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
    <div className="ad-root">
      <AdminSidebar />

      <div className="ad-main">
        {loading ? (
          <div className="ad-centered">
            <div className="ad-spinner"></div>
            <p>Loading admin analytics...</p>
          </div>
        ) : !data ? (
          <div className="ad-centered">
            <p className="ad-error">Failed to load dashboard data.</p>
          </div>
        ) : (
          <DashboardContent data={data} />
        )}
      </div>

      <style>{`
        .ad-root {
          display: flex;
          min-height: 100vh;
          background: #050f0a;
          color: #fff;
          font-family: 'Syne', sans-serif;
        }

        .ad-main {
          flex: 1;
          padding: clamp(20px, 4vw, 40px);
        }

        .ad-heading {
          font-size: clamp(22px, 4vw, 32px);
          margin-bottom: 28px;
          font-weight: 800;
        }

        /* KPI Grid */
        .ad-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .ad-kpi-card {
          background: rgba(255,255,255,0.04);
          padding: 20px;
          border-radius: 14px;
          border: 1px solid rgba(52,211,153,0.15);
          transition: transform 0.2s ease;
        }

        .ad-kpi-card:hover {
          transform: translateY(-3px);
        }

        .ad-kpi-title {
          font-size: 12px;
          opacity: 0.6;
        }

        .ad-kpi-value {
          font-size: clamp(20px, 3vw, 28px);
          margin-top: 8px;
        }

        /* Chart Grid */
        .ad-chart-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .ad-card {
          background: rgba(255,255,255,0.04);
          padding: clamp(18px, 3vw, 24px);
          border-radius: 14px;
          border: 1px solid rgba(52,211,153,0.15);
        }

        .ad-card h3 {
          margin-bottom: 18px;
        }

        /* Table */
        .ad-table-wrapper {
          overflow-x: auto;
        }

        .ad-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 400px;
        }

        .ad-table th {
          text-align: left;
          font-size: 12px;
          opacity: 0.6;
          padding-bottom: 12px;
        }

        .ad-table td {
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* Loading */
        .ad-centered {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .ad-error {
          color: #f87171;
        }

        .ad-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(52,211,153,0.2);
          border-top: 3px solid #34d399;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .ad-chart-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
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
      <h1 className="ad-heading">Admin Control Center</h1>

      {/* KPI */}
      <div className="ad-kpi-grid">
        <KPI title="Total Companies" value={data.total_companies} />
        <KPI title="Total Submissions" value={data.total_submissions} />
        <KPI title="Avg Risk Score" value={data.average_risk_score} />
        <KPI title="Highest Threat" value={highestThreat} />
      </div>

      {/* Charts */}
      <div className="ad-chart-grid">
        <div className="ad-card">
          <h3>Compliance Distribution</h3>
          <div style={{ height: "clamp(220px, 35vw, 260px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complianceData} dataKey="value" outerRadius={90} innerRadius={50}>
                  {complianceData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ad-card">
          <h3>Threat Level Breakdown</h3>
          <div style={{ height: "clamp(220px, 35vw, 260px)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.threat_level_breakdown || []}>
                <XAxis dataKey="threat_level" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="count" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line */}
      <div className="ad-card">
        <h3>Monthly Submission Trend</h3>
        <div style={{ height: "clamp(240px, 40vw, 320px)" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.submission_volume_trend || []}>
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#34d399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="ad-card">
        <h3>Top 5 Highest Risk Companies</h3>
        <div className="ad-table-wrapper">
          <table className="ad-table">
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
      </div>
    </>
  );
}

function KPI({ title, value }) {
  return (
    <div className="ad-kpi-card">
      <p className="ad-kpi-title">{title}</p>
      <h2 className="ad-kpi-value">{value ?? "-"}</h2>
    </div>
  );
}

export default AdminDashboard;