import axios from "axios";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setAuthTokens = (tokens: {
  accessToken: string | null;
  refreshToken: string | null;
}) => {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const api = axios.create({
  baseURL: "https://ziona-api-staging.onrender.com/api",
  timeout: 60000, // increased for Render cold start
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */

api.interceptors.request.use((config) => {
  console.log("🟦 API REQUEST:", config.method?.toUpperCase(), config.url);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

api.interceptors.response.use(
  (response) => {
    console.log("🟩 API RESPONSE:", response.config.url, response.status);
    return response;
  },

  async (error) => {
    console.error("🟥 API ERROR");

    console.log("message:", error.message);
    console.log("code:", error.code);
    console.log("url:", error.config?.url);
    console.log("response status:", error.response?.status);
    console.log("response data:", error.response?.data);

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔁 Attempting token refresh");

        const response = await axios.post(
          "https://ziona-api-staging.onrender.com/api/auth/refresh",
          {
            refresh_token: refreshToken,
          },
        );

        const newTokens = response.data;

        setAuthTokens({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log("❌ Token refresh failed");
        clearAuthTokens();
      }
    }

    if (error.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  },
);
