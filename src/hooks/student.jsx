// src/hooks/student.jsx
import { useState, useEffect, useCallback } from "react";
import { studentAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for student dashboard data
 */
export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    console.log("studentId: ", user);
    if (!user?.profile.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getDashboardStats(user.profile.id);
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user?.profile.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = () => {
    fetchDashboardData();
  };

  return {
    dashboardData,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for student profile management
 */
export const useStudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getById(user.id);
      updateUser(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [user?.id, updateUser]);

  const updateProfile = useCallback(
    async (profileData) => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await studentAPI.update(user.id, profileData);
        updateUser(response.data);
        return {
          success: true,
          data: response.data,
          message: "Profile updated successfully",
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to update profile";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [user?.id, updateUser]
  );

  return {
    profile: user,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};

/**
 * Hook for student attendance summary
 */
export const useStudentAttendanceSummary = (filters = {}) => {
  const { studentId } = useAuth();
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceSummary = useCallback(async () => {
    if (!studentId?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getAttendanceSummary(
        studentId.id,
        filters
      );
      setAttendanceSummary(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch attendance summary"
      );
    } finally {
      setLoading(false);
    }
  }, [studentId?.id, JSON.stringify(filters)]);

  useEffect(() => {
    fetchAttendanceSummary();
  }, [fetchAttendanceSummary]);

  const refetch = () => {
    fetchAttendanceSummary();
  };

  return {
    attendanceSummary,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch all students with optional filters
 */
export const useAllStudents = (filters = {}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getAll(filters);
      setStudents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const refetch = () => {
    fetchStudents();
  };

  return {
    students,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a specific student by ID
 */
export const useStudentById = (studentId) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudent = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getById(studentId);
      setStudent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const refetch = () => {
    fetchStudent();
  };

  return {
    student,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for student search and filtering
 */
export const useSearchStudents = (initialFilters = {}) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const searchStudents = useCallback(
    async (searchFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedFilters = { ...filters, ...searchFilters };
        const response = await studentAPI.getAll(mergedFilters);

        setStudents(response.data);
        setFilters(mergedFilters);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to search students");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Initial load
  useEffect(() => {
    searchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    filters,
    searchStudents,
    updateFilters,
    clearFilters,
    refetch: searchStudents,
  };
};

/**
 * Hook for student management operations (update, etc.)
 * Useful for admin functionality
 */
export const useStudentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateStudent = useCallback(async (studentId, studentData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await studentAPI.update(studentId, studentData);
      setSuccess(true);

      return {
        success: true,
        data: response.data,
        message: "Student updated successfully",
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update student";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    updateStudent,
    loading,
    error,
    success,
    resetState,
  };
};

/**
 * Hook for student management operations (update, etc.)
 * Useful for admin functionality
 */
export const useStudentAnalytics = (timeRange = "month") => {
  const { studentId } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("STUDENT ID: ", studentId);

  const fetchAnalytics = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      console.log("STUDENT ID UNDEFINED");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await studentAPI.getAnalytics(studentId, timeRange);
      setAnalytics(response.data);
      console.log("Analytics data:", response.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  }, [studentId, timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refetch,
  };
};
