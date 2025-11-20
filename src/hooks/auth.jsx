/* eslint-disable no-unused-vars */
// src/hooks/auth.js
import { useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * Hook for auth operations like login and registration
 * Provides loading states and error handling
 */
export const useAuthOperations = () => {
  const { login, register, loading, error } = useAuth();

  return {
    login,
    register,
    loading,
    error,
  };
};

/**
 * Hook to fetch and manage user profile data
 */
export const useProfile = () => {
  const { user, refreshUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  const updateProfile = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);

        // API call to update profile would go here
        // For now, just update local state
        updateUser(data);

        return { success: true, message: "Profile updated successfully" };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to update profile";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  return {
    profile: user?.profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};

/**
 * Hook to check authentication status
 * Returns boolean flags for different user states
 */
export const useAuthStatus = () => {
  const { user, loading, isAuthenticated, isStudent, isLecturer } = useAuth();

  return {
    isAuthenticated,
    isStudent,
    isLecturer,
    user,
    loading,
  };
};
