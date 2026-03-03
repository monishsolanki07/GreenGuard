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


// ✅ Safe Base64URL JWT Parser (production-safe)
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
}


// 🎯 Role-Based Guard (stable version)
function RoleRoute({ role, children }) {
  const token = localStorage.getItem("access_token");

  // No token → not authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const decoded = parseJwt(token);

  // Invalid token structure → force login
  if (!decoded || !decoded.role) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Correct role → allow access
  if (decoded.role === role) {
    return children;
  }

  // Wrong role → redirect to proper dashboard
  if (decoded.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/company/dashboard" replace />;
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