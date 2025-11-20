import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // Verify token is still valid
          try {
            const response = await authAPI.getProfile();
            console.log("Profile response:", response.data); // Debug log
            setUser(response.data.data);
          } catch (err) {
            // Token invalid, clear storage
            console.error("Token validation failed:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.login({ email, password });
      console.log("Login response:", response.data); // Debug log
      const { token, user: userData } = response.data;

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      return {
        success: true,
        user: userData,
        message: "Login successful",
      };
    } catch (err) {
      const errorMessage =
        err.response?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.register(userData);
      console.log("Login response:", response.data);
      const { token, user: newUser } = response.data;

      // Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);

      return {
        success: true,
        user: newUser,
        message: "Registration successful",
      };
    } catch (err) {
      const errorMessage =
        err.response?.message ||
        "Registration failed. Please check your details.";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      console.error("User refresh failed:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // FIXED: Properly extract IDs based on user role
  // The backend returns profile data differently for students and lecturers
  const getStudentId = () => {
    if (!user || user.role !== "student") return null;
    // Profile ID is the student's ID
    return user.profile?.id || null;
  };

  const getLecturerId = () => {
    if (!user || user.role !== "lecturer") return null;
    // Profile ID is the lecturer's ID
    return user.profile?.id || null;
  };

  console.log("Auth Debug:", {
    user,
    role: user?.role,
    profileId: user?.profile?.id,
    calculatedStudentId: getStudentId(),
    calculatedLecturerId: getLecturerId(),
  });

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    setError,
    isAuthenticated: !!user,
    isStudent: user?.role === "student",
    isLecturer: user?.role === "lecturer",
    // FIXED: Now properly returns IDs based on role
    studentId: getStudentId(),
    lecturerId: getLecturerId(),
    userEmail: user?.email,
    userName: user?.profile
      ? `${user.profile.first_name} ${user.profile.last_name}`
      : "",
    // Additional helpful values
    userId: user?.id,
    userRole: user?.role,
    profile: user?.profile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
