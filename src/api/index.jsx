// src/api/index.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear auth and redirect
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (window.location.pathname !== "/access") {
            window.location.href = "/access?tab=student-signin";
          }
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error - no response received");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
};

// Student endpoints
export const studentAPI = {
  getAll: (filters = {}) => api.get("/students", { params: filters }),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.put(`/students/${id}`, data),
  getAttendanceSummary: (id, filters = {}) =>
    api.get(`/students/${id}/attendance/summary`, { params: filters }),
  getClasses: (id) => api.get(`/students/${id}/classes`),
  getDashboardStats: (id) => api.get(`/students/${id}/dashboard/stats`),
  getAnalytics: (id, timeRange = "month") =>
    api.get(`/students/${id}/analytics`, { params: { timeRange } }),
};

// Lecturer endpoints
export const lecturerAPI = {
  getAll: (filters = {}) => api.get("/lecturers", { params: filters }),
  getById: (id) => api.get(`/lecturers/${id}`),
  update: (id, data) => api.put(`/lecturers/${id}`, data),
  getClasses: (id, filters = {}) =>
    api.get(`/lecturers/${id}/classes`, { params: filters }),
  getSchedule: (id, startDate, endDate) =>
    api.get(`/lecturers/${id}/schedule`, { params: { startDate, endDate } }),
  getStatistics: (id) => api.get(`/lecturers/${id}/statistics`),
  getDashboardStats: (id) => api.get(`/lecturers/${id}/dashboard/stats`),
};

// Course endpoints
export const courseAPI = {
  getAll: (filters = {}) => api.get("/courses", { params: filters }),
  getById: (id) => api.get(`/courses/${id}`),

  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  archive: (id) => api.delete(`/courses/${id}`),
  unarchive: (id) => api.post(`/courses/${id}/unarchive`),
  getClasses: (id) => api.get(`/courses/${id}/classes`),
  getStatistics: (id) => api.get(`/courses/${id}/statistics`),
  getByLecturer: (lecturerId) => api.get(`/courses/lecturer/${lecturerId}`),
};

// Class endpoints
export const classAPI = {
  getAll: (filters = {}) => api.get("/classes", { params: filters }),
  getById: (id) => api.get(`/classes/${id}`),
  getByClassCode: (class_code) => api.get(`classes/class_code/${class_code}`),
  create: (data) => api.post("/classes", data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  getStudents: (id) => api.get(`/classes/${id}/students`),
  enrollStudent: (id, studentId) =>
    api.post(`/classes/${id}/enroll`, { student_id: studentId }),
  unenrollStudent: (id, studentId) =>
    api.post(`/classes/${id}/unenroll`, { student_id: studentId }),
  getAttendanceOverview: (id, startDate, endDate) =>
    api.get(`/classes/${id}/attendance/overview`, {
      params: { startDate, endDate },
    }),
};

// Attendance endpoints
export const attendanceAPI = {
  mark: (data) => api.post("/attendance/mark", data),
  markBulk: (records) =>
    api.post("/attendance/mark/bulk", { attendance_records: records }),
  getClassAttendance: (classId, date) =>
    api.get(`/attendance/class/${classId}/date/${date}`),
  getStudentAttendance: (studentId, filters = {}) =>
    api.get(`/attendance/student/${studentId}`, { params: filters }),
  getStats: (classId, startDate, endDate) =>
    api.get(`/attendance/class/${classId}/stats`, {
      params: { startDate, endDate },
    }),
  getLecturerRecentAttendance: (lecturerId, limit = 50, courseId = null) => {
    const params = { limit };
    if (courseId) params.courseId = courseId;
    return api.get(`/attendance/lecturer/${lecturerId}/recent`, { params });
  },
};

export default api;
