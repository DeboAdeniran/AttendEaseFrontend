// src/hooks/lecturer.jsx - FIXED VERSION
import { useState, useEffect, useCallback } from "react";
import { lecturerAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for lecturer dashboard data
 * FIXED: Uses lecturerId and correct response structure
 */
export const useLecturerDashboard = () => {
  const { lecturerId } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!lecturerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lecturerAPI.getDashboardStats(lecturerId);
      // FIXED: Access response.data.data
      setDashboardStats(response.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [lecturerId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = () => {
    console.log("🔄 Refetching LECTURER DATA...");
    fetchDashboardData();
  };

  return {
    dashboardStats, // Changed from dashboardData to match usage
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for lecturer profile management
 */
export const useLecturerProfile = () => {
  const { user, lecturerId, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!lecturerId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await lecturerAPI.getById(lecturerId);
      updateUser(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [lecturerId, updateUser]);

  const updateProfile = useCallback(
    async (profileData) => {
      if (!lecturerId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await lecturerAPI.update(lecturerId, profileData);
        updateUser(response.data.data);
        return {
          success: true,
          data: response.data.data,
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
    [lecturerId, updateUser]
  );

  const refetch = () => {
    console.log("🔄 Refetching LECTURER DATA...");
    fetchProfile();
  };

  return {
    profile: user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    refetch,
  };
};

/**
 * Hook for lecturer schedule
 */
export const useLecturerSchedule = (startDate, endDate) => {
  const { lecturerId } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedule = useCallback(async () => {
    if (!lecturerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lecturerAPI.getSchedule(
        lecturerId,
        startDate,
        endDate
      );
      setSchedule(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  }, [lecturerId, startDate, endDate]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const refetch = () => {
    fetchSchedule();
  };

  return {
    schedule,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for lecturer statistics
 */
export const useLecturerStatistics = () => {
  const { lecturerId } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    if (!lecturerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lecturerAPI.getStatistics(lecturerId);
      setStatistics(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  }, [lecturerId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const refetch = () => {
    fetchStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch all lecturers with optional filters
 */
export const useAllLecturers = (filters = {}) => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLecturers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lecturerAPI.getAll(filters);
      setLecturers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lecturers");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  const refetch = () => {
    fetchLecturers();
  };

  return {
    lecturers,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a specific lecturer by ID
 */
export const useLecturerById = (lecturerId) => {
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLecturer = useCallback(async () => {
    if (!lecturerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await lecturerAPI.getById(lecturerId);
      setLecturer(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lecturer");
    } finally {
      setLoading(false);
    }
  }, [lecturerId]);

  useEffect(() => {
    fetchLecturer();
  }, [fetchLecturer]);

  const refetch = () => {
    fetchLecturer();
  };

  return {
    lecturer,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for lecturer search and filtering
 */
export const useSearchLecturers = (initialFilters = {}) => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const searchLecturers = useCallback(
    async (searchFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedFilters = { ...filters, ...searchFilters };
        const response = await lecturerAPI.getAll(mergedFilters);

        setLecturers(response.data.data || []);
        setFilters(mergedFilters);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to search lecturers");
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

  return {
    lecturers,
    loading,
    error,
    filters,
    searchLecturers,
    updateFilters,
    clearFilters,
    refetch: searchLecturers,
  };
};
