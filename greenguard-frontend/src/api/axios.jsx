import axios from "axios";

const api = axios.create({
  baseURL: "https://greenguard-backend-m87i.onrender.com/api/",
});

// ----------------------------
// REQUEST INTERCEPTOR
// ----------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  const publicEndpoints = ["login/", "users/register/"];

  const isPublic = publicEndpoints.some((endpoint) =>
    config.url.includes(endpoint)
  );

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------------
// RESPONSE INTERCEPTOR
// ----------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login") &&
      !originalRequest.url.includes("refresh")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        // ⚠ IMPORTANT: use axios, not api
        const res = await axios.post(
          "https://greenguard-backend-m87i.onrender.com/api/token/refresh/",
          { refresh: refreshToken }
        );

        localStorage.setItem("access_token", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;