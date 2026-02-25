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
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={styles.main}>
        <h1 style={styles.heading}>Pollutant Policy Management</h1>

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Pollutant Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={styles.input}
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
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Unit (ppm, µg/m³, etc)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            required
            style={styles.input}
          />

          <button style={styles.button}>
            {editingId ? "Update Policy" : "Add Policy"}
          </button>
        </form>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
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
                    <td>
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(p)}
                        style={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {policies.length === 0 && (
              <p style={{ opacity: 0.5 }}>No policies configured yet.</p>
            )}
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
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid rgba(52,211,153,0.3)",
    background: "#0b1f14",
    color: "#fff",
  },
  button: {
    padding: "10px 16px",
    background: "#34d399",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableWrapper: {
    background: "rgba(255,255,255,0.04)",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid rgba(52,211,153,0.15)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  editBtn: {
    marginRight: "8px",
    padding: "6px 10px",
    background: "rgba(59,130,246,0.2)",
    color: "#60a5fa",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 10px",
    background: "rgba(239,68,68,0.2)",
    color: "#f87171",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminPolicies;