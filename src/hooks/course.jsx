/* eslint-disable no-unused-vars */
// src/hooks/course.jsx
import { useState, useEffect, useCallback } from "react";
import { courseAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLecturerClasses } from "./class";
/**
 * Hook for course management operations (create, update, archive, unarchive)
 */
export const useCourseManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createCourse = useCallback(async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await courseAPI.create(courseData);
      setSuccess(true);

      return {
        success: true,
        data: response.data,
        message: "Course created successfully",
      };
    } catch (err) {
      // Handle API validation errors
      const errorData = err.response?.data;
      if (errorData && errorData.errors) {
        return {
          success: false,
          errors: errorData.errors,
          error: errorData.message || "Validation failed",
        };
      }

      const errorMsg = errorData?.message || "Failed to create course";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (courseId, courseData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await courseAPI.update(courseId, courseData);
      setSuccess(true);

      return {
        success: true,
        data: response.data,
        message: "Course updated successfully",
      };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update course";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await courseAPI.archive(courseId);
      setSuccess(true);

      return {
        success: true,
        message: "Course archived successfully",
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to archive course";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const unarchiveCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await courseAPI.unarchive(courseId);
      setSuccess(true);

      return {
        success: true,
        message: "Course unarchived successfully",
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to unarchive course";
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

  // Add this new hook to your hooks/course.jsx

  return {
    createCourse,
    updateCourse,
    archiveCourse,
    unarchiveCourse,
    loading,
    error,
    success,
    resetState,
  };
};

export const useLecturerCourses = () => {
  const { user } = useAuth();
  const [lecturerCourses, setLecturerCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLecturerCourses = useCallback(async () => {
    if (!user?.id || !user.profile.id) {
      console.log("USER ID", user.profile.id);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the new endpoint to get courses by lecturer ID
      const response = await courseAPI.getByLecturer(user.profile.id);
      setLecturerCourses(response.data);
      console.log("LECTURER ID;", user.profile.id);
    } catch (err) {
      console.error("Error fetching lecturer courses:", err);
      setError(
        err.response?.data?.message || "Failed to fetch lecturer courses"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.profile.id]);

  useEffect(() => {
    fetchLecturerCourses();
  }, [fetchLecturerCourses]);

  const refetch = () => {
    fetchLecturerCourses();
  };

  return {
    courses: lecturerCourses,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch detailed information about a specific course
 */
export const useCourseDetails = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseDetails = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getById(courseId);
      setCourse(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const refetch = () => {
    fetchCourseDetails();
  };

  return {
    course,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch statistics for a specific course
 */
export const useCourseStatistics = (courseId) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseStatistics = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getStatistics(courseId);
      setStatistics(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch course statistics"
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseStatistics();
  }, [fetchCourseStatistics]);

  const refetch = () => {
    fetchCourseStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch classes associated with a specific course
 */
export const useCourseClasses = (courseId, filters = {}) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseClasses = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getClasses(courseId, filters);
      setClasses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course classes");
    } finally {
      setLoading(false);
    }
  }, [courseId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchCourseClasses();
  }, [fetchCourseClasses]);

  const refetch = () => {
    fetchCourseClasses();
  };

  return {
    classes,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to search and filter courses
 */
export const useSearchCourses = (initialFilters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const searchCourses = useCallback(
    async (searchFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const mergedFilters = { ...filters, ...searchFilters };
        const response = await courseAPI.getAll(mergedFilters);

        setCourses(response.data);
        setFilters(mergedFilters);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to search courses");
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
    searchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    filters,
    searchCourses,
    updateFilters,
    clearFilters,
    refetch: searchCourses,
  };
};

/**
 * Hook to fetch all courses with optional filters
 * Simplified version without search functionality
 */
export const useAllCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getAll(filters);
      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const refetch = () => {
    fetchCourses();
  };

  return {
    courses,
    loading,
    error,
    refetch,
  };
};
