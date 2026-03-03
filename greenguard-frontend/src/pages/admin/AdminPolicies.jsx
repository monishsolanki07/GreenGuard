import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

function AdminPolicies() {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ name: "", safe_limit: "", unit: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("policies/");
      setPolicies(res.data);
    } catch {
      alert("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`policies/${editingId}/`, form);
      } else {
        await api.post("policies/", form);
      }

      setForm({ name: "", safe_limit: "", unit: "" });
      setEditingId(null);
      fetchPolicies();
    } catch {
      alert("Failed to save policy");
    }
  };

  const handleEdit = (policy) => {
    setForm({
      name: policy.name,
      safe_limit: policy.safe_limit,
      unit: policy.unit,
    });
    setEditingId(policy.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy?")) return;
    try {
      await api.delete(`policies/${id}/`);
      fetchPolicies();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="ap-root">
      <AdminSidebar />

      <div className="ap-main">
        <h1 className="ap-heading">Pollutant Policy Management</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ap-form">
          <input
            type="text"
            placeholder="Pollutant Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Safe Limit"
            value={form.safe_limit}
            onChange={(e) =>
              setForm({ ...form, safe_limit: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Unit (ppm, µg/m³)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            required
          />
          <button>
            {editingId ? "Update Policy" : "Add Policy"}
          </button>
        </form>

        {/* Table (Desktop) */}
        {loading ? (
          <p style={{ opacity: 0.6 }}>Loading policies...</p>
        ) : (
          <>
            <div className="ap-table-wrapper">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Safe Limit</th>
                    <th>Unit</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.safe_limit}</td>
                      <td>{p.unit}</td>
                      <td>{new Date(p.updated_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="ap-edit"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="ap-delete"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (Mobile) */}
            <div className="ap-cards">
              {policies.map((p) => (
                <div key={p.id} className="ap-card">
                  <div className="ap-card-top">
                    <strong>{p.name}</strong>
                    <span className="ap-date">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="ap-card-grid">
                    <div>
                      <div className="ap-label">Safe Limit</div>
                      <div>{p.safe_limit}</div>
                    </div>
                    <div>
                      <div className="ap-label">Unit</div>
                      <div>{p.unit}</div>
                    </div>
                  </div>

                  <div className="ap-card-actions">
                    <button
                      className="ap-edit"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="ap-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {policies.length === 0 && (
                <p style={{ opacity: 0.5 }}>
                  No policies configured yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .ap-root {
          display: flex;
          min-height: 100vh;
          background: #050f0a;
          color: #fff;
          font-family: 'Syne', sans-serif;
        }

        .ap-main {
          flex: 1;
          padding: clamp(20px, 4vw, 40px);
        }

        .ap-heading {
          font-size: clamp(22px, 4vw, 30px);
          margin-bottom: 24px;
          font-weight: 800;
        }

        /* Form */
        .ap-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 30px;
        }

        .ap-form input {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid rgba(52,211,153,0.3);
          background: #0b1f14;
          color: #fff;
        }

        .ap-form button {
          padding: 10px 16px;
          background: #34d399;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Table */
        .ap-table-wrapper {
          background: rgba(255,255,255,0.04);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(52,211,153,0.15);
          overflow-x: auto;
        }

        .ap-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .ap-table th {
          text-align: left;
          font-size: 12px;
          opacity: 0.6;
          padding-bottom: 12px;
        }

        .ap-table td {
          padding: 12px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .ap-edit {
          margin-right: 8px;
          padding: 6px 10px;
          background: rgba(59,130,246,0.2);
          color: #60a5fa;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .ap-delete {
          padding: 6px 10px;
          background: rgba(239,68,68,0.2);
          color: #f87171;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Cards */
        .ap-cards {
          display: none;
          flex-direction: column;
          gap: 16px;
        }

        .ap-card {
          background: rgba(255,255,255,0.04);
          padding: 18px;
          border-radius: 12px;
          border: 1px solid rgba(52,211,153,0.15);
        }

        .ap-card-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ap-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .ap-label {
          font-size: 11px;
          opacity: 0.6;
        }

        .ap-card-actions {
          display: flex;
          gap: 10px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .ap-table-wrapper {
            display: none;
          }

          .ap-cards {
            display: flex;
          }
        }

      `}</style>
    </div>
  );
}

export default AdminPolicies;