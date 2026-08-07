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

    // Augment original error to support both err.message and err.response.data.message
    Object.assign(error, errorDetails);
    return Promise.reject(error);
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


export const hostelApi = collegeApi;

export const blockApi = {
  async getAll(hostelId) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.get("/hostel/blocks", { params });
  },
  async create(data) {
    return apiClient.post("/hostel/blocks", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/blocks/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/blocks/${id}`);
  }
};

export const floorApi = {
  async getAll(blockId) {
    const params = blockId ? { blockId } : {};
    return apiClient.get("/hostel/floors", { params });
  },
  async create(data) {
    return apiClient.post("/hostel/floors", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/floors/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/floors/${id}`);
  }
};

export const roomApi = {
  async getAll(floorId) {
    const params = floorId ? { floorId } : {};
    return apiClient.get("/hostel/rooms", { params });
  },
  async create(data) {
    return apiClient.post("/hostel/rooms", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/rooms/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/rooms/${id}`);
  }
};

export const bedApi = {
  async getAll(roomId) {
    const params = roomId ? { roomId } : {};
    return apiClient.get("/hostel/beds", { params });
  },
  async create(data) {
    return apiClient.post("/hostel/beds", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/beds/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/beds/${id}`);
  }
};

export const allocationApi = {
  async getAll(params) {
    return apiClient.get("/hostel/allocations", { params });
  },
  async getById(id) {
    return apiClient.get(`/hostel/allocations/${id}`);
  },
  async create(data) {
    return apiClient.post("/hostel/allocations", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/allocations/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/allocations/${id}`);
  }
};


export const wardenApi = {
  async getAll(hostelId) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.get("/hostel/wardens", { params });
  },
  async create(data) {
    return apiClient.post("/hostel/wardens", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/wardens/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/wardens/${id}`);
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
  async getStudents() {
    return apiClient.get("/users/students");
  },
  async getAll(role = "") {
    const params = role ? { role } : {};
    return apiClient.get("/users", { params });
  },
  async create(data) {
    return apiClient.post("/users", data);
  },
  async update(id, data) {
    return apiClient.put(`/users/${id}`, data);
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

export const rolesApi = {
  async getAll() {
    return apiClient.get("/roles");
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

export const staffApi = {
  async getAll() {
    return apiClient.get("/admin/staff-management");
  },
  async create(data) {
    return apiClient.post("/admin/staff-management", data);
  },
  async update(id, data) {
    return apiClient.put(`/admin/staff-management/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/admin/staff-management/${id}`);
  },
  async getAttendance(id) {
    return apiClient.get(`/admin/staff-management/${id}/attendance`);
  }
};

export const complaintApi = {
  async getAll(params = {}) {
    return apiClient.get("/admin/complaints", { params });
  },
  async getById(id) {
    return apiClient.get(`/admin/complaints/${id}`);
  },
  async create(data) {
    return apiClient.post("/admin/complaints", data);
  },
  async update(id, data) {
    return apiClient.put(`/admin/complaints/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/admin/complaints/${id}`);
  }
};

export const admissionApi = {
  // Public (no auth)
  async getConfig(hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.get("/admission/config", { params });
  },
  async apply(formData) {
    return apiClient.post("/admission/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  // Admin (auth required)
  async listApplications(params = {}) {
    return apiClient.get("/admission/admin/admissions", { params });
  },
  async getApplication(id) {
    return apiClient.get(`/admission/admin/admissions/${id}`);
  },
  async updateStatus(id, status, remarks = "") {
    return apiClient.put(`/admission/admin/admissions/${id}/status`, { status, remarks });
  },
  async getAdminConfig(hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.get("/admission/admin/admission-config", { params });
  },
  async updateAdminConfig(config, hostelId = null) {
    const params = hostelId ? { hostelId } : {};
    return apiClient.put("/admission/admin/admission-config", config, { params });
  }
};

export const leaveApi = {
  async getAll(params = {}) {
    return apiClient.get("/hostel/leaves", { params });
  },
  async getStats() {
    return apiClient.get("/hostel/leaves/stats");
  },
  async getById(id) {
    return apiClient.get(`/hostel/leaves/${id}`);
  },
  async create(data) {
    return apiClient.post("/hostel/leaves", data);
  },
  async updateStatus(id, status, remarks = "") {
    return apiClient.put(`/hostel/leaves/${id}/status`, { status, remarks });
  },
  async update(id, data) {
    return apiClient.put(`/hostel/leaves/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/leaves/${id}`);
  }
};

export const feeApi = {
  async getDashboardStats() {
    return apiClient.get("/admin/fee-management/statistics");
  },
  async getAllFeeRecords() {
    return apiClient.get("/admin/fee-management");
  },
  async getStudentFeeRecords(studentId) {
    return apiClient.get(`/admin/fee-management/${studentId}`);
  },
  async verifyPayment(id) {
    return apiClient.put(`/admin/fee-management/${id}/verify`);
  },
  async rejectPayment(id, reason) {
    return apiClient.put(`/admin/fee-management/${id}/reject`, { reason });
  },
  async releaseReceipt(receiptId) {
    return apiClient.put(`/admin/fee-management/${receiptId}/release-receipt`);
  }
};

export const studentFeeApi = {
  async getMyReceipts() {
    return apiClient.get("/student/fees/my-receipts");
  }
};

export const allotmentLetterApi = {
  async getAll() {
    return apiClient.get("/hostel/room-allotment-letters");
  },
  async getById(id) {
    return apiClient.get(`/hostel/room-allotment-letters/${id}`);
  },
  async create(data) {
    return apiClient.post("/hostel/room-allotment-letters", data);
  },
  async update(id, data) {
    return apiClient.put(`/hostel/room-allotment-letters/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/hostel/room-allotment-letters/${id}`);
  }
};

export const allotmentTemplateApi = {
  async getActive() {
    return apiClient.get("/hostel/allotment-template/active");
  },
  async getAll() {
    return apiClient.get("/hostel/allotment-template");
  },
  async saveFormat(data) {
    return apiClient.post("/hostel/allotment-template/save-format", data);
  },
  async uploadPdf(formData) {
    return apiClient.post("/hostel/allotment-template/upload-pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
  },
  /**
   * Upload a single section PDF.
   * @param {string} section - "header" | "footer" | "main" | "terms"
   * @param {File} file - The PDF file object
   * @param {function} onProgress - Optional progress callback (0-100)
   */
  async uploadSection(section, file, onProgress) {
    const formData = new FormData();
    formData.append("section", section);
    formData.append(`${section}Pdf`, file);
    return apiClient.post("/hostel/allotment-template/upload-section", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
      onUploadProgress: onProgress
        ? (e) => {
            if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
          }
        : undefined,
    });
  },
  async upload(formData) {
    return apiClient.post("/hostel/allotment-template/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });
  },
};

export const visitorApi = {
  /** All records — generic admin use */
  async getAll() {
    return apiClient.get("/admin/visitor-management");
  },
  /** Only Pending — for Warden review queue */
  async getPending() {
    return apiClient.get("/admin/visitor-management/pending");
  },
  /** Warden-processed (Approved/Rejected/Checked-In/Out) — for Hostel Admin view */
  async getProcessed() {
    return apiClient.get("/admin/visitor-management/processed");
  },
  async getById(id) {
    return apiClient.get(`/admin/visitor-management/${id}`);
  },
  async create(data) {
    return apiClient.post("/admin/visitor-management", data);
  },
  /** Warden approve/reject a request */
  async wardenReview(id, data) {
    return apiClient.put(`/admin/visitor-management/${id}/review`, data);
  },
  async update(id, data) {
    return apiClient.put(`/admin/visitor-management/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/admin/visitor-management/${id}`);
  },
};

export const studentApi = {
  async getAll() {
    return apiClient.get("/users", { params: { role: "student" } });
  },
};

export const adminReportsApi = {
  async getSummary() {
    return apiClient.get("/admin/reports/summary");
  },
  async getFilters() {
    return apiClient.get("/admin/reports/filters");
  },
  async getCategoryData(params) {
    return apiClient.get("/admin/reports/data", { params });
  },
  async getHistory() {
    return apiClient.get("/admin/reports/history");
  },
  async generateReport(data) {
    return apiClient.post("/admin/reports/generate", data);
  },
  async logExport(data) {
    return apiClient.post("/admin/reports/log-export", data);
  },
};

// ==========================================
// Notices API
// ==========================================
export const noticeApi = {
  getNotices: () => apiClient.get("/notices"),
  createNotice: (data) => apiClient.post("/notices", data),
  updateNotice: (id, data) => apiClient.put(`/notices/${id}`, data),
  deleteNotice: (id) => apiClient.delete(`/notices/${id}`),
};

// ==========================================
// Letter API
// ==========================================
export const letterApi = {
  getStudentRequests: () => apiClient.get("/letters/student"),
  getHostelRequests: () => apiClient.get("/letters/warden"),
  requestLetter: () => apiClient.post("/letters/request"),
  approveLetter: (id) => apiClient.put(`/letters/${id}/approve`),
};
