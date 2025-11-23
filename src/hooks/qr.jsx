/* eslint-disable no-unused-vars */
// src/hooks/qr.jsx
import { useState, useCallback } from "react";
import { qrAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for QR code attendance operations
 */
export const useQRAttendance = () => {
  const { user, lecturerId, studentId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate QR code (Lecturer only)
  const generateQR = useCallback(
    async (classId, attendanceDate, validityMinutes = 15) => {
      if (!lecturerId) {
        const errorMsg = "Lecturer ID not found";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        setLoading(true);
        setError(null);

        const response = await qrAPI.generateQR({
          class_id: classId,
          attendance_date: attendanceDate,
          validity_minutes: validityMinutes,
        });

        return {
          success: true,
          data: response.data.data,
          message: "QR code generated successfully",
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to generate QR code";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [lecturerId]
  );

  // Validate QR code (Student)
  const validateQR = useCallback(async (sessionToken) => {
    try {
      setLoading(true);
      setError(null);

      const response = await qrAPI.validateQR(sessionToken);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid or expired QR code";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Scan QR code and mark attendance (Student only)
  const scanQR = useCallback(
    async (sessionToken) => {
      if (!studentId) {
        const errorMsg = "Student ID not found";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      try {
        setLoading(true);
        setError(null);

        const response = await qrAPI.scanQR(sessionToken);

        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Attendance marked successfully",
        };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to mark attendance";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [studentId]
  );

  // Get active session for a class
  const getActiveSession = useCallback(async (classId, date) => {
    try {
      setLoading(true);
      setError(null);

      const response = await qrAPI.getActiveSession(classId, date);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Deactivate session (Lecturer only)
  const deactivateSession = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      await qrAPI.deactivateSession(sessionId);

      return {
        success: true,
        message: "Session deactivated successfully",
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to deactivate session";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get scan logs (Lecturer only)
  const getScanLogs = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await qrAPI.getSessionLogs(sessionId);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch scan logs";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateQR,
    validateQR,
    scanQR,
    getActiveSession,
    deactivateSession,
    getScanLogs,
    loading,
    error,
  };
};

export default useQRAttendance;
