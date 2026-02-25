import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Upload from "./pages/company/Upload";
import History from "./pages/company/History";
import Dashboard from "./pages/company/Dashboard";
import Signup from "./pages/Signup";

// --- Admin Pages ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminHighRisk from "./pages/admin/AdminHighRisk";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminPolicies from "./pages/admin/AdminPolicies";


// 🎯 Role-Based Guard
function RoleRoute({ role, children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (decoded.role === role) {
      return children;
    } else {
      return decoded.role === "ADMIN"
        ? <Navigate to="/admin/dashboard" replace />
        : <Navigate to="/company/dashboard" replace />; // ✅ FIXED
    }

  } catch {
    return <Navigate to="/" replace />;
  }
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------- PUBLIC ---------------- */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ---------------- COMPANY ROUTES ---------------- */}
        <Route
          path="/company/dashboard"
          element={
            <RoleRoute role="COMPANY">
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/company/upload"
          element={
            <RoleRoute role="COMPANY">
              <Upload />
            </RoleRoute>
          }
        />

        <Route
          path="/company/history"
          element={
            <RoleRoute role="COMPANY">
              <History />
            </RoleRoute>
          }
        />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute role="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
  path="/admin/policies"
  element={
    <RoleRoute role="ADMIN">
      <AdminPolicies />
    </RoleRoute>
  }
/>

        <Route
          path="/admin/companies"
          element={
            <RoleRoute role="ADMIN">
              <AdminCompanies />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/submissions"
          element={
            <RoleRoute role="ADMIN">
              <AdminSubmissions />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/high-risk"
          element={
            <RoleRoute role="ADMIN">
              <AdminHighRisk />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/audit"
          element={
            <RoleRoute role="ADMIN">
              <AdminAudit />
            </RoleRoute>
          }
        />

        {/* ---------------- FALLBACK ---------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;