import axios from "axios";

console.log("📡 Axios module initialized");

const api = axios.create({
  baseURL: "https://greenguard-backend-m87i.onrender.com/api/",
});

// =============================
// REQUEST INTERCEPTOR (LOGGED)
// =============================
api.interceptors.request.use((config) => {
  console.log("--------------------------------------------------");
  console.log("📤 API REQUEST →", config.method?.toUpperCase(), config.url);

  const token = localStorage.getItem("access_token");
  console.log("🔑 Access token present:", !!token);

  const publicEndpoints = ["login/", "users/register/"];
  const isPublic = publicEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (token && !isPublic) {
    console.log("📎 Attaching Authorization header");
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("🌐 Public endpoint or no token");
  }

  return config;
});


// =============================
// RESPONSE INTERCEPTOR (LOGGED)
// =============================
api.interceptors.response.use(
  (response) => {
    console.log("✅ API SUCCESS ←", response.config.url);
    return response;
  },

  async (error) => {
    console.log("❌ API ERROR ←", error.config?.url);
    console.log("   Status:", error.response?.status);

    const originalRequest = error.config;

    // If no response (network error)
    if (!error.response) {
      console.log("🌐 Network error (no response object)");
      return Promise.reject(error);
    }

    // Only handle 401 once
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login") &&
      !originalRequest.url.includes("refresh")
    ) {
      console.log("🔄 401 detected → attempting refresh");

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      console.log("🔁 Refresh token present:", !!refreshToken);

      if (!refreshToken) {
        console.log("❌ No refresh token → clearing storage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://greenguard-backend-m87i.onrender.com/api/token/refresh/",
          { refresh: refreshToken }
        );

        console.log("✅ Refresh successful");

        localStorage.setItem("access_token", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        console.log("🔁 Retrying original request:", originalRequest.url);
        return api(originalRequest);

      } catch (refreshError) {
        console.log("❌ Refresh FAILED → clearing tokens");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;