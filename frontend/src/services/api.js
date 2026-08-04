import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper for Token Storage
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem("token"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  },
  clearTokens: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};

// Request Interceptor: Inject JWT token into headers
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple refresh calls simultaneously
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle Refresh Token and Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Standardized Error Handler
    const errorDetails = {
      message: error.response?.data?.message || "An unexpected error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    // If 401 error and not retrying yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearTokens();
        // Redirect to login if in browser context
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(errorDetails);
      }

      try {
        // Refresh token endpoint call
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

        tokenStorage.setTokens(newAccessToken, newRefreshToken);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject({
          message: "Session expired. Please sign in again.",
          status: 401,
        });
      }
    }

    return Promise.reject(errorDetails);
  }
);

// Existing mock auth API structure for compatibility (do not call endpoints yet)
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const authApi = {
  async login(payload) {
    return apiClient.post("/auth/login", payload);
  },
  async forgotPassword(email) {
    return apiClient.post("/auth/forgot-password", { email });
  },
  async resetPassword(token, password) {
    return apiClient.post("/auth/reset-password", { token, password });
  },
  async changePassword(payload) {
    return apiClient.post("/auth/change-password", payload);
  },
  async getMe() {
    return apiClient.get("/auth/me");
  }
};

export const dashboardApi = {
  async getSuperAdminStats() {
    return apiClient.get("/dashboard/superadmin");
  },
  async getHostelAdminStats() {
    return apiClient.get("/dashboard/hosteladmin");
  }
};

export const collegeApi = {
  async getAll() {
    return apiClient.get("/hostel/hostels");
  },
  async create(data) {
    return apiClient.post("/hostel/hostels", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/hostels/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/hostels/${id}`);
  },
  async addAdmin(collegeId, adminData) {
    return apiClient.post(`/hostel/hostels/${collegeId}/admins`, adminData);
  },
  async deleteAdmin(collegeId, userId) {
    return apiClient.delete(`/hostel/hostels/${collegeId}/admins/${userId}`);
  }
};

export const globalNoticeApi = {
  async getAll() {
    return apiClient.get("/super_admin/global-notice");
  },
  async create(data) {
    return apiClient.post("/super_admin/global-notice", data);
  },
  async update(id, data) {
    return apiClient.put(`/super_admin/global-notice/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/super_admin/global-notice/${id}`);
  },
};

export const userApi = {
  async getAll(role = "") {
    const params = role ? { role } : {};
    return apiClient.get("/users", { params });
  },
  async create(data) {
    return apiClient.post("/users", data);
  },
  async delete(id) {
    return apiClient.delete(`/users/${id}`);
  },
  async getProfile() {
    return apiClient.get("/users/profile");
  },
  async updateProfile(data) {
    return apiClient.put("/users/profile", data);
  }
};

export const settingsApi = {
  async get() {
    return apiClient.get("/settings");
  },
  async update(data) {
    return apiClient.put("/settings", data);
  },
  async reset() {
    return apiClient.post("/settings/reset");
  }
};

export const auditLogApi = {
  async getLogs(params) {
    return apiClient.get("/audit-logs", { params });
  }
};

export const reportsApi = {
  async getSummary(hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.get("/super_admin/reports", { params });
  },
  async getSuperAdminStats(hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.get("/super_admin/reports", { params });
  },
  async exportCsv(hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.post("/super_admin/reports", { hostelId }, { responseType: "blob", params });
  },
  async downloadSuperAdminReport(hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.post("/super_admin/reports", { hostelId }, { responseType: "blob", params });
  }
};
