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

      const results = response.data.results || response.data || [];
      setSubmissions(results);
    } catch {
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
    <div className="as-root">
      <AdminSidebar />

      <div className="as-main">
        <h1 className="as-heading">All Submissions</h1>

        {/* Filters */}
        <div className="as-filters">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
            <option value="REVIEW_REQUIRED">Review Required</option>
          </select>

          <select value={threat} onChange={(e) => setThreat(e.target.value)}>
            <option value="">All Threat Levels</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
            <option value="-created_at">Newest</option>
            <option value="risk_score">Risk Asc</option>
            <option value="-risk_score">Risk Desc</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="as-center">Loading submissions...</div>
        ) : error ? (
          <div className="as-center as-error">{error}</div>
        ) : submissions.length === 0 ? (
          <div className="as-center">No submissions found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="as-table-wrapper">
              <table className="as-table">
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
                      <tr key={item.id}>
                        <td>#{item.id}</td>
                        <td>{item.company_name}</td>
                        <td className={`as-status ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </td>
                        <td
                          className={`as-risk ${
                            risk > 7 ? "high" :
                            risk > 4 ? "medium" :
                            "low"
                          }`}
                        >
                          {risk.toFixed(2)}
                        </td>
                        <td className={`as-threat ${item.threat_level?.toLowerCase()}`}>
                          {item.threat_level}
                        </td>
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

            {/* Mobile Cards */}
            <div className="as-cards">
              {submissions.map((item) => {
                const risk = Number(item.risk_score) || 0;

                return (
                  <div key={item.id} className="as-card">
                    <div className="as-card-top">
                      <span>#{item.id}</span>
                      <span className={`as-threat ${item.threat_level?.toLowerCase()}`}>
                        {item.threat_level}
                      </span>
                    </div>

                    <div className="as-company">{item.company_name}</div>

                    <div className="as-card-grid">
                      <div>
                        <div className="as-label">Status</div>
                        <div className={`as-status ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </div>
                      </div>

                      <div>
                        <div className="as-label">Risk</div>
                        <div className={`as-risk ${
                          risk > 7 ? "high" :
                          risk > 4 ? "medium" :
                          "low"
                        }`}>
                          {risk.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <div className="as-label">Date</div>
                        <div>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        .as-root {
          display: flex;
          min-height: 100vh;
          background: #050f0a;
          color: #fff;
          font-family: 'Syne', sans-serif;
        }

        .as-main {
          flex: 1;
          padding: clamp(20px, 4vw, 40px);
        }

        .as-heading {
          font-size: clamp(22px, 4vw, 30px);
          margin-bottom: 20px;
          font-weight: 800;
        }

        /* Filters */
        .as-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .as-filters select {
          padding: 8px 12px;
          border-radius: 6px;
          background: #0b1f14;
          color: #fff;
          border: 1px solid rgba(52,211,153,0.3);
        }

        /* Table */
        .as-table-wrapper {
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(52,211,153,0.15);
          overflow-x: auto;
        }

        .as-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .as-table th {
          text-align: left;
          font-size: 12px;
          opacity: 0.6;
          padding-bottom: 12px;
        }

        .as-table td {
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .as-table tr:hover {
          background: rgba(255,255,255,0.02);
        }

        /* Status */
        .as-status.compliant { color: #34d399; }
        .as-status.non_compliant { color: #f87171; }
        .as-status.review_required { color: #fbbf24; }

        /* Risk */
        .as-risk.high { color: #f87171; font-weight: 700; }
        .as-risk.medium { color: #fbbf24; font-weight: 700; }
        .as-risk.low { color: #34d399; font-weight: 700; }

        /* Threat */
        .as-threat.high { color: #f87171; }
        .as-threat.medium { color: #fbbf24; }
        .as-threat.low { color: #34d399; }

        /* Cards */
        .as-cards {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        .as-card {
          background: rgba(255,255,255,0.04);
          padding: 18px;
          border-radius: 12px;
          border: 1px solid rgba(52,211,153,0.15);
        }

        .as-card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .as-company {
          font-weight: 700;
          margin-bottom: 12px;
        }

        .as-card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .as-label {
          font-size: 11px;
          opacity: 0.6;
        }

        /* Center */
        .as-center {
          padding: 40px 0;
        }

        .as-error {
          color: #f87171;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .as-table-wrapper {
            display: none;
          }

          .as-cards {
            display: flex;
          }
        }

      `}</style>
    </div>
  );
}

export default AdminSubmissions;