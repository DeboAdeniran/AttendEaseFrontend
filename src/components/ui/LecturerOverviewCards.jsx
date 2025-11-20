/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import Sun from "../../assets/sun.svg?react";
import Positive from "../../assets/positive.svg?react";
import Negative from "../../assets/Negative.svg?react";
import { FullPageLoader } from "../common/LoadingSpinner";
import { FullPageError } from "../common/ErrorMessage";
import { ChevronDown, Search, Plus, X, Edit2, Archive } from "lucide-react";
import { useCourseManagement } from "../../hooks";
import { useLecturerCourses, useAllCourses } from "../../hooks/course";
import { useClassManagement } from "../../hooks/class";
import { classAPI, attendanceAPI } from "../../api";
import { useLecturerClasses } from "../../hooks/class";
import { useLecturerProfile } from "../../hooks/lecturer";
import { useAuth } from "../../context/AuthContext";
// import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { useDashboard } from "../../context/DashboardContext";

const RealTimeDisplay = () => {
  const [now, setNow] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCourse, setSelectedCourse } = useDashboard();

  // Fetch lecturer's courses
  const { courses: lecturerCourses, loading } = useLecturerCourses();

  const options = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Set first course as default when courses load
  useEffect(() => {
    if (!selectedCourse && lecturerCourses?.data?.length > 0) {
      setSelectedCourse(lecturerCourses.data[0]);
    }
  }, [lecturerCourses, selectedCourse, setSelectedCourse]);

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedTime = now.toLocaleTimeString("en-US", options);
  const formattedDate = now.toLocaleDateString("en-GB", dateOptions);

  const courseOptions = lecturerCourses?.data || [];

  return (
    <div className="bg-background-grey p-6 gap-24 flex flex-col rounded-md w-full lg:w-72">
      <div className="flex items-end gap-4">
        <Sun />
        <div>
          {formattedTime}
          <p className="text-text-grey text-xs">RealTime Display</p>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex md:flex-col gap-2 md:gap-0">
          <p>Today: </p> {formattedDate}
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={loading || courseOptions.length === 0}
            className="w-full bg-blue text-xs p-2 rounded-md flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">
              {loading
                ? "Loading..."
                : selectedCourse
                ? `${selectedCourse.course_code} - ${selectedCourse.course_name}`
                : "Select Course"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform shrink-0 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && courseOptions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-background-grey border border-gray-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {courseOptions.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left text-xs p-2 hover:bg-gray-700 transition-colors border-b border-text-grey/30 last:border-0 ${
                    selectedCourse?.id === course.id ? "bg-blue" : ""
                  }`}
                >
                  <div className="font-semibold">{course.course_code}</div>
                  <div className="text-xs opacity-75 truncate">
                    {course.course_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Display selected course info */}
        {selectedCourse && (
          <div className="mt-2 p-3 bg-blue/10 border border-blue/30 rounded-md">
            <p className="text-xs text-text-grey mb-1">
              Viewing attendance for:
            </p>
            <p className="text-sm font-semibold text-white">
              {selectedCourse.course_code}
            </p>
            <p className="text-xs text-text-grey truncate">
              {selectedCourse.course_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const OverViewDetailsCard = ({ stats }) => {
  const overviewData = [
    {
      title: "Total Students",
      value: stats?.totalStudents || "0",
      info: "+2 new student joined!",
      change: "positive",
    },
    {
      title: "Present Today",
      value: stats?.presentToday || "0",
      info: "+85% attendance rate!",
      change: "positive",
    },
    {
      title: "Absent Today",
      value: stats?.absentToday || "0",
      info: "-15% of total students!",
      change: "negative",
    },
    {
      title: "Late Arrivals",
      value: stats?.lateArrivals || "0",
      info: "-5% of total students!",
      change: "negative",
    },
    {
      title: "Classes Today",
      value: stats?.classesToday || "0",
      info: "+3 classes completed!",
      change: "positive",
    },
    {
      title: "Average Attendance",
      value: stats?.averageAttendance || "0%",
      info: "+5% increase this month!",
      change: "positive",
    },
  ];

  const getChangeIcon = (change) => {
    if (change === "positive") return <Positive />;
    return <Negative />;
  };

  return (
    <>
      {overviewData.map((data, index) => (
        <div
          key={index}
          className="bg-background-grey p-6 rounded-md w-full md:w-60 lg:w-72 flex flex-col gap-2"
        >
          <p className="text-3xl font-bold">{data.value}</p>
          <p className="text-sm">{data.title}</p>
          <div className="flex gap-2">
            {getChangeIcon(data.change)}
            <p className="text-xs text-text-grey">{data.info}</p>
          </div>
        </div>
      ))}
    </>
  );
};

const DashboardAttendanceOverview = () => {
  const { lecturerId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent attendance data
  useEffect(() => {
    const fetchRecentAttendance = async () => {
      if (!lecturerId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await attendanceAPI.getLecturerRecentAttendance(
          lecturerId,
          50 // Get last 50 attendance records
        );

        setAttendanceData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching recent attendance:", err);
        setError(
          err.response?.data?.message || "Failed to load attendance data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAttendance();
  }, [lecturerId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-500/20 text-green-500";
      case "Absent":
        return "bg-red-500/20 text-red-500";
      case "Late":
        return "bg-yellow-500/20 text-yellow-500";
      case "Excused":
        return "bg-blue/20 text-blue";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPercentageColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 90) return "text-green-500";
    if (value >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const filteredData = attendanceData.filter(
    (record) =>
      record.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.matric_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.class_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-background-grey p-6 rounded-md min-h-screen">
        <LoadingSpinner text="Loading recent attendance..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-grey p-6 rounded-md min-h-screen">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="bg-background-grey p-6 rounded-md min-h-screen">
      <div className="flex flex-col md:flex-row justify-center md:items-center gap-4 md:gap-10 py-6">
        <p className="w-auto shrink-0 text-xl">Recent Attendance Overview</p>
        <div className="w-full h-full rounded-md border border-text-grey flex py-3 px-4">
          <input
            className="w-full h-full text-secondary-white bg-bg-secondary outline-0 border-0"
            placeholder="Quick Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-12 text-text-grey">
          {searchQuery
            ? "No attendance records found matching your search"
            : "No recent attendance records found"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="border-y border-text-grey">
              <tr>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Matric No
                </th>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Name
                </th>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Department
                </th>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Class
                </th>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Date
                </th>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Status
                </th>
                <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td className="px-6 py-4 text-white text-sm">
                    {record.matric_no}
                  </td>
                  <td className="px-6 py-4 text-white text-sm">
                    {record.first_name} {record.last_name}
                  </td>
                  <td className="px-6 py-4 text-text-grey text-sm">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 text-text-grey text-sm">
                    {record.class_code}
                  </td>
                  <td className="px-6 py-4 text-text-grey text-sm">
                    {new Date(record.attendance_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-semibold ${getPercentageColor(
                        record.attendance_percentage
                      )}`}
                    >
                      {record.attendance_percentage || 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AttendanceTable = ({ classes = [] }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [error, setError] = useState(null);

  // Status options
  const statusOptions = ["Present", "Absent", "Excused", "Late"];

  // Transform classes data for dropdown
  const classOptions = useMemo(() => {
    if (!classes || !Array.isArray(classes)) return [];

    return classes.map((cls) => ({
      id: cls.id,
      label: `${cls.class_code} - ${cls.course_name || cls.description}`,
      class_code: cls.class_code,
      course_name: cls.course_name,
    }));
  }, [classes]);

  // Load students when class is selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass) {
        setAttendanceData([]);
        return;
      }

      try {
        setIsLoadingStudents(true);
        setError(null);

        console.log("📚 Loading students for class:", selectedClass.id);

        // Fetch students enrolled in this class
        const response = await classAPI.getStudents(selectedClass.id);
        console.log("✅ Students response:", response.data);

        const students = response.data.data || response.data || [];

        // Initialize attendance data with default "-" status
        const initialAttendance = students.map((student) => ({
          id: student.id,
          matricNo: student.matric_no,
          name: `${student.first_name} ${student.last_name}`,
          department: student.department,
          status: "-",
          // These come from the backend query that includes attendance stats
          absentDays: student.total_sessions
            ? student.total_sessions - student.present_count
            : 0,
          percentage: student.attendance_percentage || 0,
        }));

        setAttendanceData(initialAttendance);
        console.log("👥 Loaded students:", initialAttendance.length);
      } catch (err) {
        console.error("❌ Error loading students:", err);
        setError(err.response?.data?.message || "Failed to load students");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClass]);

  // Filter students by search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return attendanceData;

    const term = searchTerm.toLowerCase();
    return attendanceData.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.matricNo.toLowerCase().includes(term)
    );
  }, [attendanceData, searchTerm]);

  // Handle status change for individual student
  const handleStatusChange = (studentId, newStatus) => {
    setHasUnsavedChanges(true);
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  // Mark all students as present
  const markAllPresent = () => {
    setHasUnsavedChanges(true);
    setAttendanceData((prevData) =>
      prevData.map((student) => ({
        ...student,
        status: "Present",
      }))
    );
  };

  // Submit attendance to backend
  const handleSubmit = async () => {
    if (!selectedClass) {
      alert("Please select a class first");
      return;
    }

    // Check if any student still has default "-" status
    const hasUnmarkedStudents = attendanceData.some(
      (student) => student.status === "-"
    );

    if (hasUnmarkedStudents) {
      if (
        !window.confirm(
          "Some students are still unmarked. Do you want to continue?"
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare attendance records for submission
      const records = attendanceData
        .filter((student) => student.status !== "-")
        .map((student) => ({
          class_id: selectedClass.id,
          student_id: student.id,
          attendance_date: selectedDate,
          status: student.status,
        }));

      if (records.length === 0) {
        alert("No attendance records to submit");
        setIsSubmitting(false);
        return;
      }

      console.log("📤 Submitting attendance:", records);

      // Call backend API
      const response = await attendanceAPI.markBulk(records);

      console.log("✅ Attendance submitted:", response.data);

      alert(
        `Attendance for ${selectedClass.class_code} on ${selectedDate} submitted successfully!`
      );

      setHasUnsavedChanges(false);

      // Reset statuses to "-" after successful submission
      setAttendanceData((prev) =>
        prev.map((student) => ({ ...student, status: "-" }))
      );
    } catch (err) {
      console.error("❌ Error submitting attendance:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Error submitting attendance. Please try again.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(
    () => ({
      present: attendanceData.filter((s) => s.status === "Present").length,
      absent: attendanceData.filter((s) => s.status === "Absent").length,
      excused: attendanceData.filter((s) => s.status === "Excused").length,
      late: attendanceData.filter((s) => s.status === "Late").length,
      unmarked: attendanceData.filter((s) => s.status === "-").length,
      total: attendanceData.length,
    }),
    [attendanceData]
  );

  return (
    <div className="bg-background-grey p-6 rounded-md min-h-screen border border-text-grey">
      <div className="flex flex-col lg:flex-row justify-between md:items-center gap-4 md:gap-10 py-6">
        <p className="w-auto shrink-0 text-start text-xl">
          Attendance Management
        </p>

        {/* Search */}
        <div className="w-full h-full rounded-md border border-text-grey flex py-3 px-4">
          <input
            className="w-full h-full text-secondary-white bg-bg-secondary outline-0 border-0"
            placeholder="Search by name or matric number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Class Selector */}
        <div className=" not-lg:hidden relative w-auto shrink-0 min-w-[200px]">
          <button
            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
            disabled={classOptions.length === 0}
            className="w-full bg-blue text-xs p-2 rounded-md flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedClass ? selectedClass.label : "Select Class"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isClassDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isClassDropdownOpen && classOptions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-background-grey border border-gray-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {classOptions.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => {
                    setSelectedClass(cls);
                    setIsClassDropdownOpen(false);
                    setHasUnsavedChanges(false);
                  }}
                  className={`w-full text-left text-xs p-2 hover:bg-gray-700 transition-colors ${
                    selectedClass?.id === cls.id ? "bg-blue" : ""
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className=" not-lg:hidden flex items-center gap-2">
          <label className="text-sm text-text-grey">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-bg-secondary text-secondary-white p-2 rounded-md border border-text-grey"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex not-lg:hidden  gap-2 w-auto  shrink-0">
          <button
            onClick={markAllPresent}
            disabled={!selectedClass || isLoadingStudents}
            className="w-auto shrink-0 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSubmit}
            disabled={!hasUnsavedChanges || isSubmitting || !selectedClass}
            className={`py-2 px-6 rounded-md text-sm transition-colors ${
              hasUnsavedChanges && !isSubmitting && selectedClass
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Submitting...
              </span>
            ) : (
              "Submit Attendance"
            )}
          </button>
        </div>
        <div className="flex lg:hidden w-full flex-wrap lg:flex-nowrap lg:flex-row items-center justify-between gap-2">
          {/* Class Selector */}
          <div className="relative w-auto shrink-0 min-w-[200px]">
            <button
              onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              disabled={classOptions.length === 0}
              className="w-full bg-blue text-xs p-2 rounded-md flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedClass ? selectedClass.label : "Select Class"}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isClassDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isClassDropdownOpen && classOptions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-background-grey border border-gray-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {classOptions.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setSelectedClass(cls);
                      setIsClassDropdownOpen(false);
                      setHasUnsavedChanges(false);
                    }}
                    className={`w-full text-left text-xs p-2 hover:bg-gray-700 transition-colors ${
                      selectedClass?.id === cls.id ? "bg-blue" : ""
                    }`}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-grey">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-bg-secondary text-secondary-white p-2 rounded-md border border-text-grey"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-auto  shrink-0">
            <button
              onClick={markAllPresent}
              disabled={!selectedClass || isLoadingStudents}
              className="w-auto shrink-0 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark All Present
            </button>

            <button
              onClick={handleSubmit}
              disabled={!hasUnsavedChanges || isSubmitting || !selectedClass}
              className={`py-2 px-6 rounded-md text-sm transition-colors ${
                hasUnsavedChanges && !isSubmitting && selectedClass
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Submitting...
                </span>
              ) : (
                "Submit Attendance"
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-md">
          <p className="text-yellow-500 text-sm flex items-center gap-2">
            <ExclamationIcon />
            You have unsaved changes. Don't forget to submit your attendance.
          </p>
        </div>
      )}

      {/* No Class Selected Message */}
      {!selectedClass && (
        <div className="text-center py-12 bg-blue/10 border border-blue rounded-lg">
          <p className="text-blue text-lg font-semibold mb-2">
            No Class Selected
          </p>
          <p className="text-text-grey text-sm">
            Please select a class from the dropdown above to mark attendance.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingStudents && (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-text-grey mt-4">Loading students...</p>
        </div>
      )}

      {/* Statistics Cards */}
      {selectedClass && !isLoadingStudents && attendanceData.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-blue/20 p-4 rounded-lg">
              <p className="text-sm text-text-grey">Total Students</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg">
              <p className="text-sm text-text-grey">Present</p>
              <p className="text-2xl font-bold text-green-500">
                {stats.present}
              </p>
            </div>
            <div className="bg-red-500/20 p-4 rounded-lg">
              <p className="text-sm text-text-grey">Absent</p>
              <p className="text-2xl font-bold text-red-500">{stats.absent}</p>
            </div>
            <div className="bg-purple-500/20 p-4 rounded-lg">
              <p className="text-sm text-text-grey">Excused</p>
              <p className="text-2xl font-bold text-purple-500">
                {stats.excused}
              </p>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-lg">
              <p className="text-sm text-text-grey">Late</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.late}</p>
            </div>
            <div className="bg-gray-500/20 p-4 rounded-lg">
              <p className="text-sm text-text-grey">Unmarked</p>
              <p className="text-2xl font-bold text-gray-400">
                {stats.unmarked}
              </p>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="border-y border-text-grey">
                <tr>
                  <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                    Matric No
                  </th>
                  <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                    Name
                  </th>
                  <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                    Department
                  </th>
                  <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
                    Status
                  </th>
                  <th className="text-center text-text-grey font-medium px-6 py-4 text-sm">
                    Total Absent
                  </th>
                  <th className="text-center text-text-grey font-medium px-6 py-4 text-sm">
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-text-grey/30 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-secondary-white">
                      {student.matricNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-white">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-white">
                      {student.department}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          handleStatusChange(student.id, e.target.value)
                        }
                        className={`text-sm px-3 py-1 rounded-md border-0 outline-0 cursor-pointer ${
                          student.status === "Present"
                            ? "bg-green-500/20 text-green-500"
                            : student.status === "Absent"
                            ? "bg-red-500/20 text-red-500"
                            : student.status === "Excused"
                            ? "bg-purple-500/20 text-purple-500"
                            : student.status === "Late"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        <option value="-">-</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm font-medium">
                        {student.absentDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span
                        className={
                          student.percentage >= 90
                            ? "text-green-500 font-bold"
                            : student.percentage >= 75
                            ? "text-yellow-500 font-bold"
                            : "text-red-500 font-bold"
                        }
                      >
                        {student.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && attendanceData.length > 0 && (
              <div className="text-center py-8 text-text-grey">
                No students found matching your search.
              </div>
            )}
          </div>
        </>
      )}

      {/* No Students in Class */}
      {selectedClass && !isLoadingStudents && attendanceData.length === 0 && (
        <div className="text-center py-12 bg-yellow-500/10 border border-yellow-500 rounded-lg">
          <p className="text-yellow-500 text-lg font-semibold mb-2">
            No Students Enrolled
          </p>
          <p className="text-text-grey text-sm">
            There are no students enrolled in this class yet.
          </p>
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const ExclamationIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const AddClassModal = ({ isOpen, onClose, onSubmit, courses = [] }) => {
  const [formData, setFormData] = useState({
    course_id: "",
    class_code: "",
    section: "",
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "11:00",
    location: "",
    max_students: 30,
    semester: "Fall 2024",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_id || !formData.class_code || !formData.location) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      course_id: "",
      class_code: "",
      section: "",
      day_of_week: "Monday",
      start_time: "09:00",
      end_time: "11:00",
      location: "",
      max_students: 30,
      semester: "Fall 2024",
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Class</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            <X size={20} className="text-text-grey" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Selection */}
            <div className="md:col-span-2">
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Course *
              </label>
              <select
                value={formData.course_id}
                onChange={(e) =>
                  setFormData({ ...formData, course_id: e.target.value })
                }
                className="w-full bg-background-grey/80 border border-text-grey  text-white text-sm p-2 rounded-md outline-0"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Code */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Class Code *
              </label>
              <input
                type="text"
                placeholder="e.g., COSC333-A"
                value={formData.class_code}
                onChange={(e) =>
                  setFormData({ ...formData, class_code: e.target.value })
                }
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                required
              />
            </div>

            {/* Section */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Section
              </label>
              <input
                type="text"
                placeholder="e.g., A"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
              />
            </div>

            {/* Day of Week */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Day of Week *
              </label>
              <select
                value={formData.day_of_week}
                onChange={(e) =>
                  setFormData({ ...formData, day_of_week: e.target.value })
                }
                className="w-full bg-background-grey/80 border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                required
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Start Time *
              </label>
              <select
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className="w-full bg-background-grey/80 border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                End Time *
              </label>
              <select
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                className="w-full bg-background-grey/80 border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Location *
              </label>
              <input
                type="text"
                placeholder="e.g., Lab A1, Room 101"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                required
              />
            </div>

            {/* Max Students */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Max Students
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.max_students}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_students: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Semester *
              </label>
              <input
                type="text"
                placeholder="e.g., Fall 2024"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Creating...
                </>
              ) : (
                "Create Class"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClassTimeTable = ({ classes = [], onClassCreated }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useAllCourses();

  const { createClass } = useClassManagement();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Transform API data to match component structure
  const transformedClasses = useMemo(() => {
    if (!classes || !Array.isArray(classes)) return [];

    // const classes = classes.data;

    return classes.map((cls) => ({
      id: cls.id,
      name: cls.class_code || cls.name || "N/A",
      course: cls.course_name || cls.description || "N/A",
      day: cls.day_of_week || "Monday",
      startTime: cls.start_time?.substring(0, 5) || "09:00",
      endTime: cls.end_time?.substring(0, 5) || "11:00",
      location: cls.location || "TBA",
      section: cls.section || "",
    }));
  }, [classes]);

  const handleCreateClass = async (classData) => {
    console.log("📝 Creating class with data:", classData);
    const result = await createClass(classData);
    if (result.success) {
      setShowAddModal(false);
      if (onClassCreated) {
        onClassCreated();
      }
      alert("Class created successfully!");
    } else {
      throw new Error(result.error || "Failed to create class");
    }
  };

  const getTimeIndex = (time) => {
    const normalizedTime = time.length === 4 ? `0${time}` : time;
    return timeSlots.indexOf(normalizedTime);
  };

  const getLeftPosition = (startTime) => {
    const idx = getTimeIndex(startTime);
    return idx >= 0 ? (idx / timeSlots.length) * 100 : 0;
  };

  const getWidth = (startTime, endTime) => {
    const startIdx = getTimeIndex(startTime);
    const endIdx = getTimeIndex(endTime);
    if (startIdx < 0 || endIdx < 0) return 10;
    return ((endIdx - startIdx) / timeSlots.length) * 100;
  };

  return (
    <>
      <div className="bg-background-grey p-6 rounded-md min-h-screen border border-text-grey">
        <div className="flex flex-row justify-between md:items-center gap-4 md:gap-10 py-6">
          <p className="w-auto shrink-0 text-xl">Class Timetable</p>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={coursesLoading}
            className="w-auto shrink-0 bg-blue hover:bg-blue/80 text-white py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} />
            Add Class
          </button>
        </div>

        {/* Show loading state */}
        {coursesLoading && (
          <div className="text-center py-8 text-text-grey">
            <p>Loading available courses...</p>
          </div>
        )}

        {/* Show error state */}
        {coursesError && (
          <div className="text-center py-8 text-red-500">
            <p>Error loading courses: {coursesError}</p>
          </div>
        )}

        {/* Show if no courses available */}
        {!coursesLoading &&
          !coursesError &&
          (!courses || courses.length === 0) && (
            <div className="text-center py-8 text-text-grey bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <p className="text-yellow-500 font-semibold mb-2">
                No courses available in the system
              </p>
              <p className="text-sm">
                Please create a course first before adding classes.
              </p>
              <p className="text-sm">
                Go to the Courses tab to create a new course.
              </p>
            </div>
          )}

        {/* Show timetable if courses exist */}
        {!coursesLoading && courses && courses.data.length > 0 && (
          <>
            <div className="rounded-md overflow-x-auto border border-text-grey">
              {/* Time axis header */}
              <div className="flex border-b-2 border-text-grey">
                <div className="w-40 border-r-2 border-text-grey py-4 px-4 shrink-0">
                  <p className="text-sm font-bold text-secondary-white">
                    Time Schedule
                  </p>
                </div>
                <div className="flex-1 relative text-text-grey min-w-[800px]">
                  <div className="flex h-full">
                    {timeSlots.map((time, idx) => (
                      <div
                        key={idx}
                        className="flex-1 border-r border-text-grey py-4 px-2 text-center"
                      >
                        <span className="text-xs font-semibold text-secondary-white">
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Days and classes */}
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="flex border-b border-text-grey min-h-32"
                >
                  {/* Day label */}
                  <div className="w-40 border-r-2 border-text-grey p-4 flex items-start shrink-0">
                    <div>
                      <p className="font-bold text-secondary-white">{day}</p>
                    </div>
                  </div>

                  {/* Time grid and class blocks */}
                  <div className="flex-1 relative min-w-[800px]">
                    <div className="flex h-32 absolute w-full">
                      {timeSlots.map((_, idx) => (
                        <div
                          key={idx}
                          className="flex-1 border-r border-text-grey"
                        ></div>
                      ))}
                    </div>

                    <div className="relative h-32">
                      {transformedClasses
                        .filter((cls) => cls.day === day)
                        .map((cls) => {
                          const leftPos = getLeftPosition(cls.startTime);
                          const width = getWidth(cls.startTime, cls.endTime);

                          return (
                            <div
                              key={cls.id}
                              className="absolute bg-blue rounded-md p-3 shadow-md hover:shadow-xl hover:bg-blue/80 transition-all cursor-pointer group h-24 flex flex-col justify-between overflow-hidden"
                              style={{
                                left: `${leftPos}%`,
                                width: `${width}%`,
                                top: "4px",
                                bottom: "4px",
                              }}
                              title={`${cls.name} - ${cls.course}`}
                            >
                              <div>
                                <p className="text-xs font-bold text-secondary-white leading-tight">
                                  {cls.name}
                                </p>
                                <p className="text-xs text-secondary-white leading-tight truncate">
                                  {cls.course}
                                </p>
                              </div>
                              <div className="text-xs text-secondary-white">
                                <p className="leading-tight">
                                  {cls.startTime} - {cls.endTime}
                                </p>
                                <p className="leading-tight truncate">
                                  📍 {cls.location}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show message if no classes scheduled */}
            {transformedClasses.length === 0 && (
              <div className="text-center py-8 text-text-grey mt-4">
                <p>
                  No classes scheduled yet. Click "Add Class" to create your
                  first class.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <AddClassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateClass}
        courses={courses.data || []}
      />
    </>
  );
};

const ClassCard = ({ classes = [] }) => {
  // Handle empty or invalid data
  if (!classes || classes.length === 0) {
    return (
      <div className="text-text-grey text-sm p-4 bg-background-grey rounded-md border border-text-grey">
        No classes found. Click "Add Class" in the timetable below to create
        your first class.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {classes.map((cls) => (
        <div
          key={cls.id}
          className="flex items-center gap-2 bg-background-grey p-4 rounded-md w-full md:w-56 h-fit border border-text-grey hover:border-blue transition"
        >
          <div className="w-4 h-4 rounded bg-blue shrink-0"></div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-semibold text-secondary-white">
              {cls.class_code || cls.name || "No Code"}
            </div>
            <div className="text-xs text-text-grey">
              {cls.course_name ||
                cls.courseName ||
                cls.description ||
                "No Course"}
            </div>
            <div className="text-xs text-text-grey">
              {cls.day_of_week || cls.day || "N/A"}{" "}
              {cls.start_time?.substring(0, 5) || cls.startTime || "N/A"} -{" "}
              {cls.end_time?.substring(0, 5) || cls.endTime || "N/A"}
            </div>
            <div className="text-xs text-text-grey">
              📍 {cls.location || "TBA"}
            </div>
            <div className="text-xs text-blue">
              {cls.enrolled_count || 0} students enrolled
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null); // Start with null
  const [minAbsentDays, setMinAbsentDays] = useState(0);
  const [maxAbsentDays, setMaxAbsentDays] = useState(10);
  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(100);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get lecturer's courses for filtering
  const { courses: lecturerCourses, loading: coursesLoading } =
    useLecturerCourses();
  const { classes: allClasses } = useLecturerClasses();

  // Course options (no "All" option)
  const courseOptions = useMemo(() => {
    if (!lecturerCourses?.data) return [];

    return (lecturerCourses.data || []).map((course) => ({
      id: course.id,
      course_id: course.id,
      label: `${course.course_code} - ${course.course_name}`,
      course_code: course.course_code,
      course_name: course.course_name,
    }));
  }, [lecturerCourses]);

  // Load students when course is selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedCourse) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(
          "📚 Loading students for course:",
          selectedCourse.course_id
        );

        // Get all classes for the selected course
        const courseClasses = (allClasses?.data || allClasses || []).filter(
          (cls) => cls.course_id === selectedCourse.course_id
        );

        console.log("🏫 Classes for course:", courseClasses);

        if (courseClasses.length === 0) {
          setStudents([]);
          setError("No classes found for this course");
          setLoading(false);
          return;
        }

        // Fetch students from each class
        const courseStudents = [];
        for (const cls of courseClasses) {
          try {
            const response = await classAPI.getStudents(cls.id);
            const classStudents = (
              response.data?.data ||
              response.data ||
              []
            ).map((student) => ({
              ...student,
              class_id: cls.id,
              class_code: cls.class_code,
              course_code: cls.course_code,
              course_name: cls.course_name,
              section: cls.section,
            }));
            courseStudents.push(...classStudents);
          } catch (err) {
            console.error(`Error loading students for class ${cls.id}:`, err);
          }
        }

        // Remove duplicates (same student in multiple sections)
        const uniqueStudents = courseStudents.reduce((acc, student) => {
          const existing = acc.find((s) => s.id === student.id);
          if (!existing) {
            acc.push({
              ...student,
              classes: [
                {
                  class_id: student.class_id,
                  class_code: student.class_code,
                  section: student.section,
                },
              ],
            });
          } else {
            // Student in multiple sections - add to classes array
            existing.classes.push({
              class_id: student.class_id,
              class_code: student.class_code,
              section: student.section,
            });
          }
          return acc;
        }, []);

        console.log("✅ Loaded students:", uniqueStudents.length);
        setStudents(uniqueStudents);
      } catch (err) {
        console.error("❌ Error loading students:", err);
        setError(err.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedCourse, allClasses]);

  // Transform students data
  const transformedStudents = useMemo(() => {
    return students.map((student) => ({
      id: student.id,
      matricNo: student.matric_no,
      name: `${student.first_name} ${student.last_name}`,
      department: student.department,
      courseCode: selectedCourse?.course_code || "N/A",
      courseName: selectedCourse?.course_name || "N/A",
      classCode:
        student.classes?.[0]?.class_code || student.class_code || "N/A",
      section: student.classes?.[0]?.section || student.section || "",
      classes: student.classes || [],
      absentDays: student.total_sessions
        ? student.total_sessions - (student.present_count || 0)
        : 0,
      percentage: Math.round(student.attendance_percentage || 0),
    }));
  }, [students, selectedCourse]);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [
      "All",
      ...new Set(transformedStudents.map((s) => s.department).filter(Boolean)),
    ];
    return depts;
  }, [transformedStudents]);

  // Filter students based on criteria
  const filteredStudents = useMemo(() => {
    return transformedStudents.filter((student) => {
      const searchMatch =
        student.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase());

      const deptMatch =
        selectedDepartment === "All" ||
        student.department === selectedDepartment;

      const absentMatch =
        student.absentDays >= minAbsentDays &&
        student.absentDays <= maxAbsentDays;

      const percentMatch =
        student.percentage >= minPercentage &&
        student.percentage <= maxPercentage;

      return searchMatch && deptMatch && absentMatch && percentMatch;
    });
  }, [
    transformedStudents,
    searchTerm,
    selectedDepartment,
    minAbsentDays,
    maxAbsentDays,
    minPercentage,
    maxPercentage,
  ]);

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-background-grey p-8 rounded-md min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Student Management</h1>

      {/* Search and Filters */}
      <div className="bg-background-grey rounded-lg p-6 mb-6 border border-text-grey">
        {/* Course Selection - REQUIRED */}
        <div className="mb-6">
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Select Course <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              onClick={() => setCourseOpen(!courseOpen)}
              disabled={coursesLoading || courseOptions.length === 0}
              className="w-full bg-blue text-white text-sm p-3 rounded-md flex items-center justify-between hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">
                {selectedCourse
                  ? selectedCourse.label
                  : "Select a course to view students"}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 ml-2 transition-transform ${
                  courseOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {courseOpen && courseOptions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-background-grey border border-text-grey rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                {courseOptions.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setCourseOpen(false);
                    }}
                    className={`w-full text-left text-sm p-3 hover:bg-gray-700 transition-colors border-b border-text-grey/30 last:border-0 ${
                      selectedCourse?.id === course.id
                        ? "bg-blue text-white"
                        : "text-text-grey"
                    }`}
                  >
                    <div className="font-semibold">{course.course_code}</div>
                    <div className="text-xs opacity-75">
                      {course.course_name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {coursesLoading && (
            <p className="text-sm text-text-grey mt-2">
              Loading your courses...
            </p>
          )}

          {!coursesLoading && courseOptions.length === 0 && (
            <p className="text-sm text-yellow-500 mt-2">
              No courses available. Please create a course and class first.
            </p>
          )}
        </div>

        {/* Only show other filters if course is selected */}
        {selectedCourse && (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Search Students
              </label>
              <div className="flex items-center gap-2 bg-bg-secondary border border-text-grey rounded-md px-4 py-2">
                <Search size={18} className="text-text-grey" />
                <input
                  type="text"
                  placeholder="Search by matric number or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-bg-secondary text-white outline-0 border-0 text-sm placeholder-text-grey"
                />
              </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Department Filter */}
              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Department
                </label>
                <div className="relative">
                  <button
                    onClick={() => setDepartmentOpen(!departmentOpen)}
                    className="w-full bg-blue text-white text-sm p-2 rounded-md flex items-center justify-between hover:opacity-90 transition"
                  >
                    <span className="truncate">{selectedDepartment}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 ml-2 transition-transform ${
                        departmentOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {departmentOpen && (
                    <div className="absolute top-full mt-1 w-full bg-background-grey border border-text-grey rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDepartment(dept);
                            setDepartmentOpen(false);
                          }}
                          className={`w-full text-left text-sm p-2 hover:bg-gray-700 transition-colors ${
                            selectedDepartment === dept
                              ? "bg-blue text-white"
                              : "text-text-grey"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Absent Days Filter */}
              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Absent Days Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minAbsentDays}
                    onChange={(e) =>
                      setMinAbsentDays(parseInt(e.target.value) || 0)
                    }
                    className="w-1/2 bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                    placeholder="Min"
                  />
                  <span className="text-text-grey">-</span>
                  <input
                    type="number"
                    min="0"
                    value={maxAbsentDays}
                    onChange={(e) =>
                      setMaxAbsentDays(parseInt(e.target.value) || 10)
                    }
                    className="w-1/2 bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Percentage Filter */}
              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Attendance % Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={minPercentage}
                    onChange={(e) =>
                      setMinPercentage(parseInt(e.target.value) || 0)
                    }
                    className="w-1/2 bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                    placeholder="Min"
                  />
                  <span className="text-text-grey">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={maxPercentage}
                    onChange={(e) =>
                      setMaxPercentage(parseInt(e.target.value) || 100)
                    }
                    className="w-1/2 bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="w-full bg-blue/20 border border-blue rounded-md p-3">
                  <p className="text-text-grey text-xs">Students Found</p>
                  <p className="text-2xl font-bold text-blue">
                    {filteredStudents.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("All");
                  setMinAbsentDays(0);
                  setMaxAbsentDays(10);
                  setMinPercentage(0);
                  setMaxPercentage(100);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded-md transition"
              >
                Clear Filters
              </button>
            </div>
          </>
        )}
      </div>

      {/* No Course Selected State */}
      {!selectedCourse && !coursesLoading && courseOptions.length > 0 && (
        <div className="text-center py-16 bg-blue/10 border-2 border-dashed border-blue rounded-lg">
          <div className="text-blue mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Select a Course</h3>
          <p className="text-text-grey mb-4">
            Choose a course from the dropdown above to view enrolled students
          </p>
          <p className="text-sm text-text-grey">
            You have {courseOptions.length} course
            {courseOptions.length !== 1 ? "s" : ""} available
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && selectedCourse && (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-text-grey mt-4">
            Loading students for {selectedCourse.course_code}...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && selectedCourse && (
        <div className="text-center py-12 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-lg font-semibold mb-2">
            Error Loading Students
          </p>
          <p className="text-text-grey text-sm">{error}</p>
        </div>
      )}

      {/* Students Table */}
      {selectedCourse && !loading && !error && (
        <>
          <div className="bg-background-grey rounded-lg overflow-hidden border border-text-grey">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background-grey border-b border-text-grey">
                    <th className="text-left text-text-grey font-semibold px-6 py-4 text-sm">
                      Matric No
                    </th>
                    <th className="text-left text-text-grey font-semibold px-6 py-4 text-sm">
                      Name
                    </th>
                    <th className="text-left text-text-grey font-semibold px-6 py-4 text-sm">
                      Department
                    </th>
                    <th className="text-left text-text-grey font-semibold px-6 py-4 text-sm">
                      Class/Section
                    </th>
                    <th className="text-center text-text-grey font-semibold px-6 py-4 text-sm">
                      Absent Days
                    </th>
                    <th className="text-center text-text-grey font-semibold px-6 py-4 text-sm">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-text-grey/30 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-white text-sm font-medium">
                        {student.matricNo}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-text-grey text-sm">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 text-text-grey text-sm">
                        {student.classes && student.classes.length > 1 ? (
                          <div className="flex flex-col">
                            <span>{student.classes[0].class_code}</span>
                            <span className="text-xs text-blue">
                              +{student.classes.length - 1} more section
                              {student.classes.length - 1 !== 1 ? "s" : ""}
                            </span>
                          </div>
                        ) : (
                          student.classCode
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-md text-sm font-medium">
                          {student.absentDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-bold text-sm ${getPercentageColor(
                            student.percentage
                          )}`}
                        >
                          {student.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Results */}
            {filteredStudents.length === 0 && students.length > 0 && (
              <div className="text-center py-12">
                <p className="text-text-grey text-sm">
                  No students found matching your filters
                </p>
              </div>
            )}

            {/* No Students in Course */}
            {students.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-text-grey text-sm">
                  No students enrolled in {selectedCourse.course_code} yet
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {students.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-background-grey border border-text-grey rounded-lg p-4">
                <p className="text-text-grey text-xs font-semibold">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-white mt-2">
                  {transformedStudents.length}
                </p>
              </div>
              <div className="bg-background-grey border border-text-grey rounded-lg p-4">
                <p className="text-text-grey text-xs font-semibold">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-blue mt-2">
                  {filteredStudents.length}
                </p>
              </div>
              <div className="bg-background-grey border border-text-grey rounded-lg p-4">
                <p className="text-text-grey text-xs font-semibold">
                  Avg Attendance
                </p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  {filteredStudents.length > 0
                    ? Math.round(
                        filteredStudents.reduce(
                          (sum, s) => sum + s.percentage,
                          0
                        ) / filteredStudents.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-background-grey border border-text-grey rounded-lg p-4">
                <p className="text-text-grey text-xs font-semibold">
                  Avg Absent Days
                </p>
                <p className="text-2xl font-bold text-red-400 mt-2">
                  {filteredStudents.length > 0
                    ? (
                        filteredStudents.reduce(
                          (sum, s) => sum + s.absentDays,
                          0
                        ) / filteredStudents.length
                      ).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CourseManagement = ({
  courses = [],
  loading,
  error,
  onCreateCourse,
  onUpdateCourse,
  onArchiveCourse,
  onUnarchiveCourse,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    description: "",
    credits: "",
    semester: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      console.log("❌ Courses is not an array:", courses);
      return [];
    }

    console.log("✅ Filtering courses:", courses.length);

    return courses.filter(
      (course) =>
        !course.is_archived && // ✅ Use is_archived from backend
        (course.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.course_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [courses, searchTerm]);

  const handleOpenModal = (course = null) => {
    setApiError(null);
    if (course) {
      setEditingCourse(course);
      setFormData({
        course_code: course.course_code || "",
        course_name: course.course_name || "",
        description: course.description || "",
        credits: course.credits?.toString() || "",
        semester: course.semester || "",
      });
    } else {
      setEditingCourse(null);
      setFormData({
        course_code: "",
        course_name: "",
        description: "",
        credits: "",
        semester: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setIsSubmitting(false);
    setApiError(null);
  };

  const handleSubmit = async () => {
    if (
      !formData.course_code ||
      !formData.course_name ||
      !formData.credits ||
      !formData.semester
    ) {
      setApiError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const courseData = {
        course_code: formData.course_code,
        course_name: formData.course_name,
        description: formData.description || null,
        credits: parseInt(formData.credits),
        semester: formData.semester,
      };

      let result;
      if (editingCourse) {
        result = await onUpdateCourse(editingCourse.id, courseData);
      } else {
        result = await onCreateCourse(courseData);
      }

      if (result.success) {
        alert(result.message || "Course operation completed successfully!");
        handleCloseModal();
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors
            .map((err) => err.msg || err.message)
            .join(", ");
          setApiError(errorMessages);
        } else {
          setApiError(result.error || "Operation failed. Please try again.");
        }
      }
    } catch (err) {
      setApiError("An unexpected error occurred. Please try again.");
      console.error("Course operation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to archive this course?")) {
      const result = await onArchiveCourse(courseId);
      if (result.success) {
        alert(result.message || "Course archived successfully!");
      } else {
        alert(result.error || "Failed to archive course.");
      }
    }
  };

  const handleUnarchiveCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to unarchive this course?")) {
      const result = await onUnarchiveCourse(courseId);
      if (result.success) {
        alert(result.message || "Course unarchived successfully!");
      } else {
        alert(result.error || "Failed to unarchive course.");
      }
    }
  };

  if (loading) return <FullPageLoader text="Loading courses..." />;
  if (error) return <FullPageError message={error} />;

  return (
    <div className="bg-background-grey p-4 md:p-8 rounded-md min-h-screen">
      <div className="flex flex-col gap-6 md:flex-row md:gap-0 justify-between items-center mb-8">
        <div className="self-start w-full md:w-auto  ">
          <h1 className="text-3xl font-bold text-white pt-4 md:pt-0">
            My Courses
          </h1>
          <p className="text-text-grey text-sm mt-1">
            Courses you are currently teaching
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full justify-center md:w-auto bg-blue text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add New Course
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 bg-bg-secondary border border-text-grey rounded-md px-4 py-2">
          <Search size={18} className="text-text-grey" />
          <input
            type="text"
            placeholder="Search by course code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-secondary text-white outline-0 border-0 text-sm placeholder-text-grey"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-background-grey border border-text-grey rounded-lg p-6 hover:border-blue transition cursor-pointer"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue font-bold text-lg">
                  {course.course_code || "N/A"}
                </p>
                <p className="text-white font-semibold text-sm mt-1">
                  {course.course_name || "Unnamed Course"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(course);
                  }}
                  className="p-2 hover:bg-gray-700 rounded transition"
                  title="Edit course"
                >
                  <Edit2 size={16} className="text-text-grey" />
                </button>
                {course.archived ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnarchiveCourse(course.id);
                    }}
                    className="p-2 hover:bg-gray-700 rounded transition"
                    title="Unarchive course"
                  >
                    <Archive size={16} className="text-text-grey" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveCourse(course.id);
                    }}
                    className="p-2 hover:bg-gray-700 rounded transition"
                    title="Archive course"
                  >
                    <Archive size={16} className="text-text-grey" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-text-grey text-xs mb-4 line-clamp-2">
              {course.description || "No description available"}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-text-grey/30">
              <div>
                <p className="text-text-grey text-xs">Credits</p>
                <p className="text-white font-semibold">
                  {course.credits || 0}
                </p>
              </div>
              <div>
                <p className="text-text-grey text-xs">Semester</p>
                <p className="text-white font-semibold text-sm">
                  {course.semester || "Not specified"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-text-grey text-xs">Enrolled</p>
                <p className="text-blue font-bold">
                  {course.total_enrollments || course.enrollmentCount || 0}
                </p>
              </div>
              <div>
                <p className="text-text-grey text-xs">Attendance</p>
                <p
                  className={`font-bold ${
                    (course.avg_attendance_rate ||
                      course.attendanceRate ||
                      0) >= 85
                      ? "text-green-500"
                      : (course.avg_attendance_rate ||
                          course.attendanceRate ||
                          0) >= 70
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {course.avg_attendance_rate || course.attendanceRate || 0}%
                </p>
              </div>
              <div>
                <p className="text-text-grey text-xs">Classes</p>
                <p className="text-white font-bold">
                  {course.class_count || course.classCount || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-text-grey text-lg mb-2">
            {courses && courses.length > 0
              ? "No courses found matching your search"
              : "You are not teaching any courses yet"}
          </p>
          {(!courses || courses.length === 0) && (
            <p className="text-text-grey text-sm">
              Create your first course to get started
            </p>
          )}
        </div>
      )}

      {/* Add/Edit Course Modal - Updated field names */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X size={20} className="text-text-grey" />
              </button>
            </div>

            {/* API Error Display */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
                <p className="text-red-500 text-sm">{apiError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., COSC 333"
                  value={formData.course_code}
                  onChange={(e) =>
                    setFormData({ ...formData, course_code: e.target.value })
                  }
                  className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                />
              </div>

              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Compiler Design"
                  value={formData.course_name}
                  onChange={(e) =>
                    setFormData({ ...formData, course_name: e.target.value })
                  }
                  className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                />
              </div>

              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Course description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0 resize-none"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-grey text-sm font-semibold mb-2">
                    Credits *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    placeholder="e.g., 3"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({ ...formData, credits: e.target.value })
                    }
                    className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                  />
                </div>

                <div>
                  <label className="block text-text-grey text-sm font-semibold mb-2">
                    Semester/Year *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fall 2024"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      {editingCourse ? "Updating..." : "Creating..."}
                    </>
                  ) : editingCourse ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal - Updated field names */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue font-bold text-lg">
                  {selectedCourse.course_code || "N/A"}
                </p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedCourse.course_name || "Unnamed Course"}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X size={20} className="text-text-grey" />
              </button>
            </div>

            <p className="text-text-grey text-sm mb-6">
              {selectedCourse.description || "No description available"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Credits</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.credits || 0}
                </p>
              </div>
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Semester</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.semester || "Not specified"}
                </p>
              </div>
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Enrolled Students</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.total_enrollments ||
                    selectedCourse.enrollmentCount ||
                    0}
                </p>
              </div>
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Classes</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.class_count || selectedCourse.classCount || 0}
                </p>
              </div>
            </div>

            <div className="bg-background-grey border border-text-grey/30 rounded-lg p-4 mb-6">
              <p className="text-text-grey text-xs mb-2">
                Overall Attendance Rate
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (selectedCourse.avg_attendance_rate ||
                        selectedCourse.attendanceRate ||
                        0) >= 85
                        ? "bg-green-500"
                        : (selectedCourse.avg_attendance_rate ||
                            selectedCourse.attendanceRate ||
                            0) >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        selectedCourse.avg_attendance_rate ||
                        selectedCourse.attendanceRate ||
                        0
                      }%`,
                    }}
                  ></div>
                </div>
                <span
                  className={`font-bold ${
                    (selectedCourse.avg_attendance_rate ||
                      selectedCourse.attendanceRate ||
                      0) >= 85
                      ? "text-green-500"
                      : (selectedCourse.avg_attendance_rate ||
                          selectedCourse.attendanceRate ||
                          0) >= 70
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedCourse.avg_attendance_rate ||
                    selectedCourse.attendanceRate ||
                    0}
                  %
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCourse(null)}
              className="w-full bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LecturerProfile = () => {
  const { profile, loading, error, fetchProfile, updateProfile, refetch } =
    useLecturerProfile();

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    office_location: "",
    bio: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    classReminders: true,
    attendanceAlerts: true,
    lowAttendanceWarnings: true,
    systemUpdates: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfileToStudents: true,
    allowDataAnalytics: true,
    showContactInfo: false,
  });

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      // Handle nested profile structure
      const profileData = profile.profile || profile;

      setFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || profile.email || "",
        phone: profileData.phone || "",
        department: profileData.department || "",
        office_location: profileData.office_location || "",
        bio: profileData.bio || "",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setUpdateError(null);
    setSuccessMessage(null);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        refetch();
      } else {
        setUpdateError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setUpdateError("An unexpected error occurred");
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        department: profile.department || "",
        office_location: profile.office_location || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
    setUpdateError(null);
  };

  const handleChangePassword = () => {
    // TODO: Implement password change modal
    alert("Password change functionality - integrate with your auth system");
  };

  if (loading && !profile) {
    return <FullPageLoader text="Loading profile..." />;
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-background-grey p-6 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 w-full bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 rounded-md p-3 mb-4">
          <p className="text-green-500 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {updateError && (
        <div className="bg-red-500/20 border border-red-500 rounded-md p-3 mb-4">
          <p className="text-red-500 text-sm">{updateError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            disabled={!isEditing}
            placeholder="+234 XXX XXX XXXX"
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            disabled={!isEditing}
            placeholder="e.g., Computer Science"
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Office Location
          </label>
          <input
            type="text"
            value={formData.office_location}
            onChange={(e) =>
              setFormData({ ...formData, office_location: e.target.value })
            }
            disabled={!isEditing}
            placeholder="e.g., Building A, Room 301"
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        {/* Display-only fields */}
        <div className="md:col-span-2 border-t border-text-grey/30 pt-4">
          <p className="text-text-grey text-xs font-semibold mb-4">
            Account Information
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-grey text-xs mb-1">
                Staff ID
              </label>
              <p className="text-white text-sm font-mono bg-bg-secondary border border-text-grey p-2 rounded">
                {profile?.profile.staff_id || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-text-grey text-xs mb-1">
                Member Since
              </label>
              <p className="text-white text-sm bg-bg-secondary border border-text-grey p-2 rounded">
                {profile?.profile.created_at
                  ? new Date(profile.profile.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>

      <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-6">
        <div className="flex flex-col gap-4 md:gap-0  md:items-start md:justify-between md:flex-row ">
          <div>
            <p className="text-white font-semibold mb-1">Password</p>
            <p className="text-text-grey text-sm">
              Manage your account password
            </p>
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-6">
        <p className="text-white font-semibold mb-4">Active Sessions</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-text-grey/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-blue text-lg">💻</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  Current Device
                </p>
                <p className="text-text-grey text-xs">Active now</p>
              </div>
            </div>
            <span className="text-green-500 text-xs font-semibold">
              Current
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5 shrink-0">
            <span className="text-black text-xs font-bold">!</span>
          </div>
          <div>
            <p className="text-yellow-500 font-semibold text-sm mb-1">
              Security Tip
            </p>
            <p className="text-text-grey text-xs">
              Always log out from shared devices and never share your password
              with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {Object.entries({
          classReminders: {
            label: "Class Reminders",
            description: "Get notified 30 minutes before class",
          },
          attendanceAlerts: {
            label: "Attendance Alerts",
            description: "Daily attendance status updates",
          },
          lowAttendanceWarnings: {
            label: "Low Attendance Warnings",
            description: "Alert when class attendance drops below 85%",
          },
          systemUpdates: {
            label: "System Updates",
            description: "Important system maintenance and updates",
          },
          emailNotifications: {
            label: "Email Notifications",
            description: "Receive notifications via email",
          },
          pushNotifications: {
            label: "Push Notifications",
            description: "Receive push notifications on your devices",
          },
        }).map(([key, { label, description }]) => (
          <div
            key={key}
            className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{label}</p>
                <p className="text-text-grey text-xs mt-1">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[key]}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      [key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => alert("Notification settings saved!")}
        className="w-full bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
      >
        Save Notification Settings
      </button>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Privacy Settings</h2>

      <div className="space-y-4">
        {Object.entries({
          showProfileToStudents: {
            label: "Show Profile to Students",
            description: "Allow students to view your profile information",
          },
          showContactInfo: {
            label: "Show Contact Information",
            description: "Display your email and phone number to students",
          },
          allowDataAnalytics: {
            label: "Allow Data Analytics",
            description:
              "Help improve the system by sharing anonymous usage data",
          },
        }).map(([key, { label, description }]) => (
          <div
            key={key}
            className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{label}</p>
                <p className="text-text-grey text-xs mt-1">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings[key]}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      [key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => alert("Privacy settings saved!")}
        className="w-full bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
      >
        Save Privacy Settings
      </button>

      <div className="bg-blue/10 border border-blue/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue rounded-full flex items-center justify-center mt-0.5 shrink-0">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="text-blue font-semibold text-sm mb-1">
              Privacy Information
            </p>
            <p className="text-text-grey text-xs">
              Your personal data is protected and will never be shared with
              third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalInfo();
      case "security":
        return renderSecurity();
      case "notifications":
        return renderNotifications();
      case "privacy":
        return renderPrivacy();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-background-grey text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
          <p className="text-text-grey">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap space-x-1 mb-8 bg-bg-secondary rounded-lg p-1">
          {[
            { key: "personal", label: "Personal" },
            { key: "security", label: "Security" },
            { key: "notifications", label: "Notifications" },
            { key: "privacy", label: "Privacy" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === key
                  ? "bg-blue text-white"
                  : "text-text-grey hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-bg-secondary rounded-lg p-6 border border-text-grey">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const LecturerOverviewCards = {
  RealTimeDisplay,
  OverViewDetailsCard,
  DashboardAttendanceOverview,
  AttendanceTable,
  ClassTimeTable,
  ClassCard,
  StudentManagement,
  CourseManagement,
  LecturerProfile,
};

export default LecturerOverviewCards;
