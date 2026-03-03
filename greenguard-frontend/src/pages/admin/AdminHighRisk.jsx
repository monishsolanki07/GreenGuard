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
    <div className="ahr-root">
      <AdminSidebar />

      <div className="ahr-main">
        <h1 className="ahr-heading">High Risk Monitor</h1>

        <button
          onClick={() => setUrgent(!urgent)}
          className={`ahr-toggle ${urgent ? "urgent-on" : ""}`}
        >
          {urgent ? "Disable Urgent Mode" : "Enable Urgent Mode"}
        </button>

        {/* Desktop Table */}
        <div className="ahr-table-wrapper">
          <table className="ahr-table">
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
                  <td>#{item.id}</td>
                  <td>{item.company_name}</td>
                  <td className="ahr-risk">
                    {item.risk_score}
                  </td>
                  <td className={`ahr-threat ${item.threat_level?.toLowerCase()}`}>
                    {item.threat_level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="ahr-cards">
          {data.map(item => (
            <div key={item.id} className="ahr-card">
              <div className="ahr-card-top">
                <span className="ahr-id">#{item.id}</span>
                <span className={`ahr-threat ${item.threat_level?.toLowerCase()}`}>
                  {item.threat_level}
                </span>
              </div>

              <div className="ahr-company">
                {item.company_name}
              </div>

              <div className="ahr-risk">
                Risk Score: {item.risk_score}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ahr-root {
          display: flex;
          min-height: 100vh;
          background: #050f0a;
          color: #fff;
          font-family: 'Syne', sans-serif;
        }

        .ahr-main {
          flex: 1;
          padding: clamp(20px, 4vw, 40px);
        }

        .ahr-heading {
          font-size: clamp(22px, 4vw, 30px);
          margin-bottom: 20px;
          font-weight: 800;
        }

        .ahr-toggle {
          margin-bottom: 24px;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.1);
          color: #f87171;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ahr-toggle:hover {
          transform: translateY(-2px);
        }

        .ahr-toggle.urgent-on {
          background: rgba(239,68,68,0.2);
          box-shadow: 0 0 20px rgba(239,68,68,0.4);
        }

        /* Table */
        .ahr-table-wrapper {
          overflow-x: auto;
          background: rgba(255,255,255,0.04);
          border-radius: 14px;
          border: 1px solid rgba(239,68,68,0.15);
          padding: 20px;
        }

        .ahr-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }

        .ahr-table th {
          text-align: left;
          font-size: 12px;
          opacity: 0.6;
          padding-bottom: 14px;
        }

        .ahr-table td {
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .ahr-table tr:hover {
          background: rgba(255,255,255,0.02);
        }

        .ahr-risk {
          color: #f87171;
          font-weight: 700;
        }

        .ahr-threat.high { color: #f87171; font-weight: 600; }
        .ahr-threat.medium { color: #fbbf24; font-weight: 600; }
        .ahr-threat.low { color: #34d399; font-weight: 600; }

        /* Cards (hidden desktop) */
        .ahr-cards {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        .ahr-card {
          background: rgba(255,255,255,0.04);
          border-radius: 14px;
          padding: 18px;
          border: 1px solid rgba(239,68,68,0.15);
        }

        .ahr-card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ahr-id {
          opacity: 0.6;
        }

        .ahr-company {
          font-weight: 700;
          margin-bottom: 8px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .ahr-table-wrapper {
            display: none;
          }

          .ahr-cards {
            display: flex;
          }
        }

      `}</style>
    </div>
  );
}

export default AdminHighRisk;