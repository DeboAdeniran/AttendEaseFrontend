// src/hooks/class.jsx
import { useState, useEffect, useCallback } from "react";
import { classAPI, lecturerAPI, studentAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for lecturer to fetch their classes
 */
export const useLecturerClasses = (filters = {}) => {
  const { user, lecturerId } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLecturerClasses = useCallback(async () => {
    // Try multiple ways to get lecturer ID
    const lecId =
      lecturerId ||
      user?.lecturerId ||
      user?.profile?.id ||
      (user?.role === "lecturer" ? user?.profile?.id : null);

    console.log("🔍 Lecturer ID Detection:", {
      fromAuth: lecturerId,
      fromUser: user?.lecturerId,
      fromProfile: user?.profile?.id,
      userRole: user?.role,
      finalLecId: lecId,
    });

    if (!lecId) {
      console.error("❌ No lecturer ID found");
      setError("Lecturer ID not found. Please try logging in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📡 Fetching classes for lecturer ID:", lecId);
      const response = await lecturerAPI.getClasses(lecId, filters);

      console.log("✅ Classes API Response:", response.data);

      // Handle different response structures
      const classesData = response.data?.data || response.data || [];
      console.log("📚 Extracted classes:", classesData);

      setClasses(classesData);
    } catch (err) {
      console.error("❌ Error fetching classes:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  }, [lecturerId, user, JSON.stringify(filters)]);

  useEffect(() => {
    fetchLecturerClasses();
  }, [fetchLecturerClasses]);

  const refetch = () => {
    console.log("🔄 Refetching classes...");
    fetchLecturerClasses();
  };

  return {
    classes,
    loading,
    error,
    refetch,
  };
};
/**
 * Hook to fetch students in a specific class
 */
export const useClassStudents = (classId) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassStudents = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await classAPI.getStudents(classId);
      setStudents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch class students");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassStudents();
  }, [fetchClassStudents]);

  const refetch = () => {
    fetchClassStudents();
  };

  return {
    students,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for student to fetch their enrolled classes
 */
export const useStudentClasses = (studentId) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentClasses = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getClasses(studentId);
      setClasses(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch student classes"
      );
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentClasses();
  }, [fetchStudentClasses]);

  const refetch = () => {
    fetchStudentClasses();
  };

  return {
    classes,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for enrolling a student in a class
 */
// export const useEnrollClass = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const enrollStudent = useCallback(async (classId, studentId) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setSuccess(false);

//       await classAPI.enrollStudent(classId, studentId);
//       setSuccess(true);

//       return { success: true, message: "Student enrolled successfully" };
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || "Failed to enroll student";
//       setError(errorMsg);
//       return { success: false, error: errorMsg };
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const resetState = () => {
//     setLoading(false);
//     setError(null);
//     setSuccess(false);
//   };

//   return {
//     enrollStudent,
//     loading,
//     error,
//     success,
//     resetState,
//   };
// };
// In hooks/class.jsx
export const useEnrollClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const enrollStudent = useCallback(async (classId, studentId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await classAPI.enrollStudent(classId, studentId);
      setSuccess(true);

      return {
        success: true,
        message: response.data?.message || "Successfully enrolled in class",
        data: response.data,
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to enroll in class";
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
    enrollStudent,
    loading,
    error,
    success,
    resetState,
  };
};

/**
 * Hook to fetch detailed information about a specific class
 */
export const useClassDetails = (classId) => {
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassDetails = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await classAPI.getById(classId);
      setClassDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch class details");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  const refetch = () => {
    fetchClassDetails();
  };

  return {
    classDetails,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch attendance overview for a class
 */
export const useClassAttendanceOverview = (classId, startDate, endDate) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceOverview = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await classAPI.getAttendanceOverview(
        classId,
        startDate,
        endDate
      );
      setOverview(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch attendance overview"
      );
    } finally {
      setLoading(false);
    }
  }, [classId, startDate, endDate]);

  useEffect(() => {
    fetchAttendanceOverview();
  }, [fetchAttendanceOverview]);

  const refetch = () => {
    fetchAttendanceOverview();
  };

  return {
    overview,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for class management operations (create, update, delete)
 */
export const useClassManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClass = useCallback(async (classData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await classAPI.create(classData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create class";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClass = useCallback(async (classId, classData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await classAPI.update(classId, classData);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update class";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteClass = useCallback(async (classId) => {
    try {
      setLoading(true);
      setError(null);
      await classAPI.delete(classId);
      return { success: true, message: "Class deleted successfully" };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete class";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = () => {
    setError(null);
  };

  return {
    createClass,
    updateClass,
    deleteClass,
    loading,
    error,
    resetError,
  };
};
/**
 * Hook to fetch detailed information about a specific class
 */
export const useClassDetailsByClassCode = (classCode) => {
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassDetails = useCallback(async () => {
    if (!classCode) return;

    try {
      setLoading(true);
      setError(null);
      const response = await classAPI.getByClassCode(classCode);
      setClassDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch class details");
    } finally {
      setLoading(false);
    }
  }, [classCode]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  const refetch = () => {
    fetchClassDetails();
  };

  return {
    classDetails,
    loading,
    error,
    refetch,
  };
};
