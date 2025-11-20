// src/hooks/attendance.js
import { useState, useEffect, useCallback } from "react";
import { attendanceAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for managing attendance operations (Lecturer use)
 * Provides functions to mark individual or bulk attendance
 */
export const useAttendanceManagement = (classId) => {
  const { lecturerId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Mark single student attendance
  const markAttendance = useCallback(
    async (studentId, date, status, notes = null) => {
      if (!lecturerId) {
        const errorMsg = "Lecturer ID not found";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        await attendanceAPI.mark({
          class_id: classId,
          student_id: studentId,
          attendance_date: date,
          status: status,
          marked_by: lecturerId,
          notes: notes,
        });

        const successMsg = "Attendance marked successfully";
        setSuccess(successMsg);
        return { success: true, message: successMsg };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to mark attendance";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [classId, lecturerId]
  );

  // Mark multiple students attendance at once
  const markBulkAttendance = useCallback(
    async (attendanceRecords) => {
      if (!lecturerId) {
        const errorMsg = "Lecturer ID not found";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Add class_id and marked_by to all records
        const records = attendanceRecords
          .filter((record) => record.status !== "-") // Filter out unmarked
          .map((record) => ({
            class_id: classId,
            student_id: record.student_id,
            attendance_date: record.attendance_date,
            status: record.status,
            marked_by: lecturerId,
            notes: record.notes || null,
          }));

        if (records.length === 0) {
          const errorMsg = "No attendance records to submit";
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }

        await attendanceAPI.markBulk(records);

        const successMsg = `Successfully marked attendance for ${
          records.length
        } student${records.length > 1 ? "s" : ""}`;
        setSuccess(successMsg);
        return {
          success: true,
          message: successMsg,
          count: records.length,
        };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to mark bulk attendance";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [classId, lecturerId]
  );

  // Get attendance for a specific class and date
  const getClassAttendance = useCallback(
    async (date) => {
      try {
        setLoading(true);
        setError(null);

        const response = await attendanceAPI.getClassAttendance(classId, date);
        return { success: true, data: response.data.data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch attendance";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [classId]
  );

  // Get attendance statistics for date range
  const getAttendanceStats = useCallback(
    async (startDate, endDate) => {
      try {
        setLoading(true);
        setError(null);

        const response = await attendanceAPI.getStats(
          classId,
          startDate,
          endDate
        );
        return { success: true, data: response.data.data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch statistics";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [classId]
  );

  // Clear error and success messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    markAttendance,
    markBulkAttendance,
    getClassAttendance,
    getAttendanceStats,
    loading,
    error,
    success,
    clearMessages,
  };
};

/**
 * Hook for fetching student's attendance records
 * Auto-fetches on mount and when filters change
 */
export const useStudentAttendance = (filters = {}) => {
  const { studentId } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await attendanceAPI.getStudentAttendance(
        studentId,
        filters
      );

      // Transform backend data to frontend format
      const transformedAttendance = response.data.data.map((record) => ({
        id: record.id,
        classCode: record.class_code,
        courseName: record.course_name,
        courseCode: record.course_code,
        date: record.attendance_date,
        time: `${record.start_time || "N/A"} - ${record.end_time || "N/A"}`,
        status: record.status,
        markedBy: record.marked_by_name,
        location: record.location || "N/A",
        notes: record.notes,
      }));

      setAttendance(transformedAttendance);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setError(
        err.response?.data?.message || "Failed to load attendance records"
      );
    } finally {
      setLoading(false);
    }
  }, [studentId, JSON.stringify(filters)]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return {
    attendance,
    loading,
    error,
    refetch: fetchAttendance,
  };
};

/**
 * Hook for managing attendance table state
 * Handles marking, bulk operations, and submission
 */
export const useAttendanceTable = (initialStudents, classId) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { markBulkAttendance, loading, error, success } =
    useAttendanceManagement(classId);

  // Initialize attendance data when students change
  useEffect(() => {
    if (initialStudents && initialStudents.length > 0) {
      setAttendanceData(
        initialStudents.map((student) => ({
          ...student,
          status: student.status || "-",
        }))
      );
    }
  }, [initialStudents]);

  // Handle single student status change
  const handleStatusChange = useCallback((studentId, newStatus) => {
    setHasUnsavedChanges(true);
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  }, []);

  // Mark all students as present
  const markAllPresent = useCallback(() => {
    setHasUnsavedChanges(true);
    setAttendanceData((prev) =>
      prev.map((student) => ({
        ...student,
        status: "Present",
      }))
    );
  }, []);

  // Mark all students as absent
  const markAllAbsent = useCallback(() => {
    setHasUnsavedChanges(true);
    setAttendanceData((prev) =>
      prev.map((student) => ({
        ...student,
        status: "Absent",
      }))
    );
  }, []);

  // Reset all to unmarked
  const resetAll = useCallback(() => {
    setHasUnsavedChanges(false);
    setAttendanceData((prev) =>
      prev.map((student) => ({
        ...student,
        status: "-",
      }))
    );
  }, []);

  // Submit attendance
  const handleSubmit = useCallback(async () => {
    // Check if any student is unmarked
    const hasUnmarked = attendanceData.some(
      (student) => student.status === "-"
    );

    if (hasUnmarked) {
      const confirm = window.confirm(
        "Some students are still unmarked. Do you want to continue?"
      );
      if (!confirm) return { success: false };
    }

    // Prepare records for submission
    const records = attendanceData
      .filter((student) => student.status !== "-")
      .map((student) => ({
        student_id: student.id,
        attendance_date: selectedDate,
        status: student.status,
        notes: null,
      }));

    if (records.length === 0) {
      alert("No attendance records to submit");
      return { success: false };
    }

    const result = await markBulkAttendance(records);

    if (result.success) {
      setHasUnsavedChanges(false);
    }

    return result;
  }, [attendanceData, selectedDate, markBulkAttendance]);

  // Calculate statistics
  const stats = {
    present: attendanceData.filter((s) => s.status === "Present").length,
    absent: attendanceData.filter((s) => s.status === "Absent").length,
    excused: attendanceData.filter((s) => s.status === "Excused").length,
    late: attendanceData.filter((s) => s.status === "Late").length,
    unmarked: attendanceData.filter((s) => s.status === "-").length,
    total: attendanceData.length,
  };

  return {
    attendanceData,
    stats,
    hasUnsavedChanges,
    selectedDate,
    setSelectedDate,
    handleStatusChange,
    markAllPresent,
    markAllAbsent,
    resetAll,
    handleSubmit,
    loading,
    error,
    success,
  };
};
