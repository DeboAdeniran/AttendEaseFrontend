// src/hooks/index.js
// Central export file for all custom hooks
// Import any hook from this file: import { useStudentDashboard } from '../hooks';

// ===================================
// ATTENDANCE HOOKS
// ===================================
export {
  useAttendanceManagement,
  useStudentAttendance,
  useAttendanceTable,
} from "./attendance";

// ===================================
// AUTHENTICATION HOOKS
// ===================================
export { useAuthOperations, useProfile, useAuthStatus } from "./auth";

// ===================================
// CLASS HOOKS
// ===================================
export {
  useLecturerClasses,
  useClassStudents,
  useStudentClasses,
  useEnrollClass,
  useClassDetails,
  useClassAttendanceOverview,
} from "./class";

// ===================================
// COURSE HOOKS
// ===================================
export {
  useCourseManagement,
  useCourseDetails,
  useCourseStatistics,
  useCourseClasses,
  useSearchCourses,
} from "./course";

// ===================================
// LECTURER HOOKS
// ===================================
export {
  useLecturerDashboard,
  useLecturerProfile,
  useLecturerSchedule,
  useLecturerStatistics,
  useAllLecturers,
  useLecturerById,
} from "./lecturer";

// ===================================
// STUDENT HOOKS
// ===================================
export {
  useStudentDashboard,
  useStudentProfile,
  useStudentAttendanceSummary,
  useAllStudents,
  useStudentById,
  useSearchStudents,
  useStudentAnalytics,
} from "./student";
