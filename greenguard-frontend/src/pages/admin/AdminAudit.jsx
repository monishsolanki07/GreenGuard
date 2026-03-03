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
    <div className="audit-root">
      <AdminSidebar />

      <div className="audit-main">
        <h1 className="audit-heading">Audit Intelligence</h1>

        {!data ? (
          <p style={{ opacity: 0.6 }}>Loading audit metrics...</p>
        ) : (
          <div className="audit-grid">

            {data.most_violated_pollutant && (
              <div className="audit-card">
                <h3>Most Violated Pollutant</h3>
                <p className="audit-highlight-red">
                  {data.most_violated_pollutant.name} — {data.most_violated_pollutant.count}
                </p>
              </div>
            )}

            <div className="audit-card">
              <h3>Total Unknown Pollutants</h3>
              <p className="audit-highlight-yellow">
                {data.total_unknown_pollutants}
              </p>
            </div>

            <div className="audit-card audit-span-2">
              <h3>Repeated Offenders</h3>
              <div className="audit-table-wrapper">
                <table className="audit-table">
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
            </div>

            <div className="audit-card audit-span-2">
              <h3>Top 5 Highest Average Risk</h3>
              <div style={{ height: "clamp(240px, 40vw, 320px)" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.top_5_highest_average_risk_companies}>
                    <XAxis dataKey="submission__company__company_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg_risk" fill="#f87171" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .audit-root {
          display: flex;
          min-height: 100vh;
          background: #050f0a;
          color: #fff;
          font-family: 'Syne', sans-serif;
        }

        .audit-main {
          flex: 1;
          padding: clamp(20px, 4vw, 40px);
        }

        .audit-heading {
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 800;
          margin-bottom: 28px;
        }

        /* Grid layout */
        .audit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 20px;
        }

        .audit-span-2 {
          grid-column: span 2;
        }

        .audit-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(52,211,153,0.1);
          padding: clamp(18px, 3vw, 24px);
          border-radius: 14px;
          backdrop-filter: blur(6px);
          transition: transform 0.2s ease;
        }

        .audit-card:hover {
          transform: translateY(-3px);
        }

        .audit-card h3 {
          margin-bottom: 16px;
          font-size: 16px;
        }

        .audit-highlight-red {
          color: #f87171;
          font-size: 20px;
          font-weight: 700;
        }

        .audit-highlight-yellow {
          color: #fbbf24;
          font-size: 20px;
          font-weight: 700;
        }

        /* Table */
        .audit-table-wrapper {
          overflow-x: auto;
        }

        .audit-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 400px;
        }

        .audit-table th {
          text-align: left;
          padding-bottom: 10px;
          font-size: 12px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.5);
        }

        .audit-table td {
          padding: 10px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 14px;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .audit-grid {
            grid-template-columns: 1fr;
          }

          .audit-span-2 {
            grid-column: span 1;
          }
        }

      `}</style>
    </div>
  );
}

export default AdminAudit;