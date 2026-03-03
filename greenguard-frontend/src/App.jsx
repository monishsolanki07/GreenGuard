import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

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


// ==============================
// JWT PARSER (with logs)
// ==============================
function parseJwt(token) {
  try {
    console.log("🔎 Parsing JWT...");
    const base64Url = token.split(".")[1];

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const decoded = JSON.parse(atob(padded));
    console.log("✅ JWT Decoded:", decoded);
    return decoded;

  } catch (error) {
    console.log("❌ JWT Parse Failed:", error);
    return null;
  }
}


// ==============================
// ROLE ROUTE (FULL TRACE)
// ==============================
function RoleRoute({ role, children }) {
  console.log("--------------------------------------------------");
  console.log("🛡️ RoleRoute INIT for role:", role);

  const [checked, setChecked] = React.useState(false);
  const [allowed, setAllowed] = React.useState(false);
  const [redirectPath, setRedirectPath] = React.useState("/");

  React.useEffect(() => {
    console.log("🔄 RoleRoute useEffect running...");

    const token = localStorage.getItem("access_token");
    console.log("📦 Token from localStorage:", token);

    if (!token) {
      console.log("❌ No token found → will redirect to /");
      setRedirectPath("/");
      setChecked(true);
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded || !decoded.role) {
      console.log("❌ Invalid token or missing role → clearing storage");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setRedirectPath("/");
    }
    else if (decoded.role === role) {
      console.log("✅ Access granted. Role matches:", decoded.role);
      setAllowed(true);
    }
    else if (decoded.role === "ADMIN") {
      console.log("➡ Role mismatch → redirecting to /admin/dashboard");
      setRedirectPath("/admin/dashboard");
    }
    else {
      console.log("➡ Role mismatch → redirecting to /company/dashboard");
      setRedirectPath("/company/dashboard");
    }

    setChecked(true);
  }, [role]);

  if (!checked) {
    console.log("⏳ Waiting for role verification...");
    return null;
  }

  if (!allowed) {
    console.log("🚪 Navigation triggered →", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log("🎉 Rendering protected content for role:", role);
  return children;
}


// ==============================
// APP ROOT (Boot Log)
// ==============================
function App() {
  console.log("🚀 APP MOUNTED");
  console.log("📍 Current URL:", window.location.pathname);

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
        <Route
          path="*"
          element={
            (() => {
              console.log("⚠ FALLBACK ROUTE TRIGGERED");
              return <Navigate to="/" replace />;
            })()
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;