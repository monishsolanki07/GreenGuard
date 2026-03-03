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
    config.url?.includes(endpoint)
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

    // If no response, just reject
    if (!error.response) {
      return Promise.reject(error);
    }

    // Only handle 401 once
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login") &&
      !originalRequest.url.includes("refresh")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://greenguard-backend-m87i.onrender.com/api/token/refresh/",
          { refresh: refreshToken }
        );

        localStorage.setItem("access_token", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);

      } catch (refreshError) {
        // ❌ DO NOT FORCE NAVIGATION
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;