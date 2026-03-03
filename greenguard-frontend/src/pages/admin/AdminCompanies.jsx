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
    <div className="ac-root">
      <AdminSidebar />

      <div className="ac-main">
        <h1 className="ac-heading">Company Control Panel</h1>

        {loading ? (
          <div className="ac-center">
            <div className="ac-spinner"></div>
            <p>Loading companies...</p>
          </div>
        ) : error ? (
          <div className="ac-center">
            <p style={{ color: "#f87171" }}>{error}</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="ac-center">
            <p style={{ opacity: 0.6 }}>No companies registered yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="ac-table-wrapper">
              <table className="ac-table">
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
                      <tr key={company.id}>
                        <td>{company.company_name}</td>
                        <td style={{ opacity: 0.7 }}>{company.username}</td>

                        <td>
                          <span className={`ac-badge ${company.is_active ? "active" : "inactive"}`}>
                            {company.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td>{company.submission_count}</td>

                        <td
                          className={`ac-risk ${
                            risk > 7 ? "high" :
                            risk > 4 ? "medium" :
                            "low"
                          }`}
                        >
                          {risk.toFixed(2)}
                        </td>

                        <td>
                          <button
                            className={`ac-action ${company.is_active ? "deactivate" : "activate"}`}
                            onClick={() => toggleStatus(company.id, company.is_active)}
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

            {/* Mobile Cards */}
            <div className="ac-cards">
              {companies.map(company => {
                const risk = Number(company.average_risk) || 0;

                return (
                  <div key={company.id} className="ac-card">
                    <div className="ac-card-top">
                      <div>
                        <div className="ac-company">{company.company_name}</div>
                        <div className="ac-username">{company.username}</div>
                      </div>

                      <span className={`ac-badge ${company.is_active ? "active" : "inactive"}`}>
                        {company.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="ac-card-grid">
                      <div>
                        <div className="ac-label">Submissions</div>
                        <div>{company.submission_count}</div>
                      </div>

                      <div>
                        <div className="ac-label">Avg Risk</div>
                        <div className={`ac-risk ${
                          risk > 7 ? "high" :
                          risk > 4 ? "medium" :
                          "low"
                        }`}>
                          {risk.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button
                      className={`ac-action ${company.is_active ? "deactivate" : "activate"}`}
                      onClick={() => toggleStatus(company.id, company.is_active)}
                    >
                      {company.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        .ac-root {
          display: flex;
          min-height: 100vh;
          background: #050f0a;
          color: #fff;
          font-family: 'Syne', sans-serif;
        }

        .ac-main {
          flex: 1;
          padding: clamp(20px, 4vw, 40px);
        }

        .ac-heading {
          font-size: clamp(22px, 4vw, 30px);
          margin-bottom: 28px;
        }

        /* Table */
        .ac-table-wrapper {
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(52,211,153,0.15);
          overflow-x: auto;
        }

        .ac-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        .ac-table th {
          text-align: left;
          font-size: 12px;
          opacity: 0.6;
          padding-bottom: 14px;
        }

        .ac-table td {
          padding: 14px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .ac-table tr:hover {
          background: rgba(255,255,255,0.02);
        }

        /* Cards */
        .ac-cards {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        .ac-card {
          background: rgba(255,255,255,0.04);
          padding: 18px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .ac-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .ac-company {
          font-weight: 700;
        }

        .ac-username {
          font-size: 13px;
          opacity: 0.6;
        }

        .ac-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .ac-label {
          font-size: 11px;
          opacity: 0.6;
        }

        /* Badges */
        .ac-badge {
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
        }

        .ac-badge.active {
          background: rgba(52,211,153,0.15);
          color: #34d399;
        }

        .ac-badge.inactive {
          background: rgba(239,68,68,0.15);
          color: #f87171;
        }

        /* Risk colors */
        .ac-risk.high { color: #f87171; font-weight: 700; }
        .ac-risk.medium { color: #fbbf24; font-weight: 700; }
        .ac-risk.low { color: #34d399; font-weight: 700; }

        /* Buttons */
        .ac-action {
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 8px;
        }

        .ac-action.activate {
          background: rgba(52,211,153,0.1);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.3);
        }

        .ac-action.deactivate {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.3);
        }

        /* Center states */
        .ac-center {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }

        .ac-spinner {
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

        /* Responsive */
        @media (max-width: 1024px) {
          .ac-table-wrapper {
            display: none;
          }

          .ac-cards {
            display: flex;
          }
        }

      `}</style>
    </div>
  );
}

export default AdminCompanies;