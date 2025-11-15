/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingDown,
  CheckCircle,
  User,
  TrendingUp,
  Plus,
  X,
  QrCode,
  MapPin,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  XCircle,
  AlertCircle,
} from "lucide-react";

const StudentWelcomeCard = ({ studentName = "Adebayo Johnson" }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-linear-to-br from-blue to-blue/80 p-6 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-white/80 text-sm">{getGreeting()}!</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {studentName}
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-white/90">
            <Clock size={16} />
            <span className="text-sm">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Calendar size={16} />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverallAttendanceCard = ({ percentage = 87 }) => {
  const getAttendanceStatus = () => {
    if (percentage >= 85)
      return { text: "Excellent", color: "text-green-500", bg: "bg-green-500" };
    if (percentage >= 75)
      return { text: "Good", color: "text-yellow-500", bg: "bg-yellow-500" };
    return { text: "At Risk", color: "text-red-500", bg: "bg-red-500" };
  };

  const status = getAttendanceStatus();

  return (
    <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-text-grey text-sm">Overall Attendance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-bold ${status.color}`}>
              {percentage}%
            </span>
            <span className={`text-sm ${status.color}`}>{status.text}</span>
          </div>
        </div>
        <CheckCircle className={status.color} size={24} />
      </div>

      <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
        <div
          className={`h-3 rounded-full ${status.bg} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage < 85 && (
        <p className="text-xs text-yellow-500 mt-3 flex items-center gap-1">
          <AlertTriangle size={12} />
          You need {85 - percentage}% more to meet the minimum requirement
        </p>
      )}
    </div>
  );
};

const QuickStatsCards = ({ stats }) => {
  return (
    <>
      <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-grey text-sm">Total Classes</p>
            <p className="text-3xl font-bold text-white mt-1">
              {stats.totalClasses}
            </p>
          </div>
          <div className="bg-blue/20 p-3 rounded-lg">
            <Calendar className="text-blue" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-grey text-sm">Present Days</p>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {stats.presentDays}
            </p>
          </div>
          <div className="bg-green-500/20 p-3 rounded-lg">
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-grey text-sm">Absent Days</p>
            <p className="text-3xl font-bold text-red-500 mt-1">
              {stats.absentDays}
            </p>
          </div>
          <div className="bg-red-500/20 p-3 rounded-lg">
            <TrendingDown className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-grey text-sm">At Risk Classes</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {stats.atRiskClasses}
            </p>
          </div>
          <div className="bg-yellow-500/20 p-3 rounded-lg">
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>
    </>
  );
};

const TodaysClassesCard = () => {
  const todaysClasses = [
    {
      id: 1,
      courseCode: "COSC 333",
      courseName: "Compiler Design",
      time: "9:00 AM - 11:00 AM",
      location: "Lab A1",
      status: "upcoming",
      attendance: 92,
    },
    {
      id: 2,
      courseCode: "COSC 402",
      courseName: "Database Systems",
      time: "1:00 PM - 3:00 PM",
      location: "Lab C3",
      status: "upcoming",
      attendance: 85,
    },
    {
      id: 3,
      courseCode: "COSC 401",
      courseName: "Web Development",
      time: "3:00 PM - 5:00 PM",
      location: "Lab A2",
      status: "upcoming",
      attendance: 78,
    },
  ];

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-500/20 text-green-500";
    if (status === "ongoing") return "bg-blue/20 text-blue";
    return "bg-gray-500/20 text-gray-400";
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
      <h2 className="text-xl font-bold text-white mb-4">Today's Classes</h2>

      <div className="space-y-3">
        {todaysClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-bg-secondary p-4 rounded-lg border border-text-grey/30 hover:border-blue transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-blue font-bold">{classItem.courseCode}</p>
                <p className="text-white text-sm">{classItem.courseName}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${getStatusColor(
                  classItem.status
                )}`}
              >
                {classItem.status.charAt(0).toUpperCase() +
                  classItem.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-text-grey mt-3">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{classItem.time}</span>
              </div>
              <span>📍 {classItem.location}</span>
            </div>

            <div className="mt-3 pt-3 border-t border-text-grey/30">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-grey">Your Attendance</span>
                <span
                  className={`text-sm font-bold ${getAttendanceColor(
                    classItem.attendance
                  )}`}
                >
                  {classItem.attendance}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Class Attendance Breakdown
const ClassAttendanceBreakdown = () => {
  const classAttendance = [
    {
      courseCode: "COSC 333",
      courseName: "Compiler Design",
      attendance: 92,
      presentDays: 23,
      totalDays: 25,
      atRisk: false,
    },
    {
      courseCode: "COSC 402",
      courseName: "Database Systems",
      attendance: 85,
      presentDays: 17,
      totalDays: 20,
      atRisk: false,
    },
    {
      courseCode: "COSC 401",
      courseName: "Web Development",
      attendance: 78,
      presentDays: 14,
      totalDays: 18,
      atRisk: true,
    },
    {
      courseCode: "COSC 360",
      courseName: "UI/UX Design",
      attendance: 88,
      presentDays: 15,
      totalDays: 17,
      atRisk: false,
    },
    {
      courseCode: "COSC 350",
      courseName: "Networks",
      attendance: 72,
      presentDays: 13,
      totalDays: 18,
      atRisk: true,
    },
  ];

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getBarColor = (percentage) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
      <h2 className="text-xl font-bold text-white mb-4">Attendance by Class</h2>

      <div className="space-y-4">
        {classAttendance.map((cls) => (
          <div key={cls.courseCode} className="bg-bg-secondary p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-blue font-bold">{cls.courseCode}</p>
                  {cls.atRisk && (
                    <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle size={10} />
                      At Risk
                    </span>
                  )}
                </div>
                <p className="text-white text-sm">{cls.courseName}</p>
              </div>
              <span
                className={`text-xl font-bold ${getAttendanceColor(
                  cls.attendance
                )}`}
              >
                {cls.attendance}%
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full ${getBarColor(
                  cls.attendance
                )} transition-all duration-500`}
                style={{ width: `${cls.attendance}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-text-grey">
                {cls.presentDays} / {cls.totalDays} classes attended
              </span>
              {cls.atRisk && (
                <span className="text-xs text-yellow-500">
                  Need {Math.ceil(cls.totalDays * 0.85 - cls.presentDays)} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notifications Panel
const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      type: "upcoming",
      title: "Upcoming Class",
      message: "COSC 333 - Compiler Design starts in 30 minutes",
      time: "30 min",
      icon: Clock,
      color: "text-blue",
    },
    {
      id: 2,
      type: "warning",
      title: "Low Attendance Warning",
      message: "COSC 350 attendance is below 75%. Current: 72%",
      time: "1 hour ago",
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      id: 3,
      type: "update",
      title: "Attendance Updated",
      message: "Your attendance for COSC 402 has been marked as Present",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: 4,
      type: "warning",
      title: "Attendance Alert",
      message: "You were marked Absent for COSC 360 on Nov 13",
      time: "1 day ago",
      icon: TrendingDown,
      color: "text-red-500",
    },
  ];

  return (
    <div className="bg-background-grey p-6 rounded-lg border border-text-grey">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        <Bell className="text-blue" size={20} />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className="bg-bg-secondary p-4 rounded-lg border border-text-grey/30 hover:border-blue transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`${notification.color} mt-1`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">
                    {notification.title}
                  </p>
                  <p className="text-text-grey text-xs mt-1">
                    {notification.message}
                  </p>
                  <p className="text-text-grey text-xs mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StudentClassesView = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [joinMethod, setJoinMethod] = useState("code"); // 'code' or 'qr'
  const [classCode, setClassCode] = useState("");

  const enrolledClasses = [
    {
      id: 1,
      classCode: "COSC333-A",
      courseCode: "COSC 333",
      courseName: "Compiler Design",
      lecturerName: "Dr. Adewale Ogunleye",
      schedule: [
        { day: "Monday", time: "9:00 AM - 11:00 AM", location: "Lab A1" },
        { day: "Wednesday", time: "2:00 PM - 4:00 PM", location: "Lab A1" },
      ],
      attendance: 92,
      presentDays: 23,
      totalDays: 25,
      semester: "Fall 2024",
      credits: 3,
      status: "active",
    },
    {
      id: 2,
      classCode: "COSC402-IT",
      courseCode: "COSC 402",
      courseName: "Database Systems",
      lecturerName: "Prof. Chioma Nwankwo",
      schedule: [
        { day: "Tuesday", time: "10:00 AM - 12:00 PM", location: "Lab C3" },
        { day: "Thursday", time: "1:00 PM - 3:00 PM", location: "Lab C3" },
      ],
      attendance: 85,
      presentDays: 17,
      totalDays: 20,
      semester: "Fall 2024",
      credits: 4,
      status: "active",
    },
    {
      id: 3,
      classCode: "COSC401-CS",
      courseCode: "COSC 401",
      courseName: "Web Development",
      lecturerName: "Dr. Ibrahim Musa",
      schedule: [
        { day: "Monday", time: "1:00 PM - 3:00 PM", location: "Lab A2" },
        { day: "Friday", time: "9:00 AM - 11:00 AM", location: "Lab A2" },
      ],
      attendance: 78,
      presentDays: 14,
      totalDays: 18,
      semester: "Fall 2024",
      credits: 3,
      status: "at-risk",
    },
    {
      id: 4,
      classCode: "COSC360-SE",
      courseCode: "COSC 360",
      courseName: "UI/UX Design",
      lecturerName: "Mrs. Folake Adewale",
      schedule: [
        { day: "Tuesday", time: "1:00 PM - 2:00 PM", location: "Lab B1" },
      ],
      attendance: 88,
      presentDays: 15,
      totalDays: 17,
      semester: "Fall 2024",
      credits: 2,
      status: "active",
    },
    {
      id: 5,
      classCode: "COSC350-IT",
      courseCode: "COSC 350",
      courseName: "Computer Networks",
      lecturerName: "Dr. Yetunde Okafor",
      schedule: [
        { day: "Wednesday", time: "10:00 AM - 12:00 PM", location: "Room E2" },
        { day: "Friday", time: "2:00 PM - 4:00 PM", location: "Room E2" },
      ],
      attendance: 72,
      presentDays: 13,
      totalDays: 18,
      semester: "Fall 2024",
      credits: 3,
      status: "at-risk",
    },
  ];

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getBarColor = (percentage) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (status, attendance) => {
    if (status === "at-risk" || attendance < 85) {
      return (
        <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded flex items-center gap-1">
          <AlertTriangle size={12} />
          At Risk
        </span>
      );
    }
    return (
      <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded flex items-center gap-1">
        <CheckCircle size={12} />
        On Track
      </span>
    );
  };

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      alert("Please enter a class code");
      return;
    }
    // In a real app, this would make an API call
    alert(`Attempting to join class with code: ${classCode}`);
    setClassCode("");
    setShowJoinModal(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            My Classes
          </h1>
          <p className="text-text-grey text-sm mt-1">
            {enrolledClasses.length} enrolled classes
          </p>
        </div>
        <button
          onClick={() => setShowJoinModal(true)}
          className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Join New Class
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs">Total Classes</p>
          <p className="text-2xl font-bold text-white mt-1">
            {enrolledClasses.length}
          </p>
        </div>
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs">Average Attendance</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {Math.round(
              enrolledClasses.reduce((sum, cls) => sum + cls.attendance, 0) /
                enrolledClasses.length
            )}
            %
          </p>
        </div>
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs">At Risk Classes</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {enrolledClasses.filter((cls) => cls.attendance < 85).length}
          </p>
        </div>
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs">Total Credits</p>
          <p className="text-2xl font-bold text-blue mt-1">
            {enrolledClasses.reduce((sum, cls) => sum + cls.credits, 0)}
          </p>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-background-grey border border-text-grey rounded-lg p-6 hover:border-blue transition-colors cursor-pointer"
            onClick={() => setSelectedClass(classItem)}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-blue font-bold text-lg">
                    {classItem.courseCode}
                  </p>
                  {getStatusBadge(classItem.status, classItem.attendance)}
                </div>
                <p className="text-white font-semibold">
                  {classItem.courseName}
                </p>
                <p className="text-text-grey text-sm mt-1">
                  Section: {classItem.classCode}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-3xl font-bold ${getAttendanceColor(
                    classItem.attendance
                  )}`}
                >
                  {classItem.attendance}%
                </p>
                <p className="text-text-grey text-xs">attendance</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getBarColor(
                    classItem.attendance
                  )} transition-all duration-500`}
                  style={{ width: `${classItem.attendance}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-text-grey">
                  {classItem.presentDays} / {classItem.totalDays} classes
                  attended
                </span>
                {classItem.attendance < 85 && (
                  <span className="text-xs text-yellow-500">
                    Need{" "}
                    {Math.ceil(
                      classItem.totalDays * 0.85 - classItem.presentDays
                    )}{" "}
                    more
                  </span>
                )}
              </div>
            </div>

            {/* Lecturer Info */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-text-grey/30">
              <User size={16} className="text-text-grey" />
              <span className="text-text-grey text-sm">
                {classItem.lecturerName}
              </span>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              {classItem.schedule.map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue" />
                    <span className="text-white font-medium">
                      {session.day}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-grey text-xs">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{session.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-text-grey/30">
              <span className="text-xs text-text-grey">
                {classItem.credits} Credits • {classItem.semester}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedClass(classItem);
                }}
                className="text-blue text-sm hover:underline"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Join New Class</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X size={20} className="text-text-grey" />
              </button>
            </div>

            {/* Method Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setJoinMethod("code")}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition ${
                  joinMethod === "code"
                    ? "bg-blue text-white"
                    : "bg-bg-secondary text-text-grey"
                }`}
              >
                Class Code
              </button>
              <button
                onClick={() => setJoinMethod("qr")}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition ${
                  joinMethod === "qr"
                    ? "bg-blue text-white"
                    : "bg-bg-secondary text-text-grey"
                }`}
              >
                QR Code
              </button>
            </div>

            {/* Join by Code */}
            {joinMethod === "code" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-text-grey text-sm font-semibold mb-2">
                    Enter Class Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., COSC333-A-2024"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition"
                  />
                  <p className="text-xs text-text-grey mt-2">
                    Ask your lecturer for the class code
                  </p>
                </div>

                <button
                  onClick={handleJoinClass}
                  className="w-full bg-blue hover:opacity-90 text-white py-3 rounded-md text-sm transition"
                >
                  Join Class
                </button>
              </div>
            )}

            {/* Join by QR */}
            {joinMethod === "qr" && (
              <div className="space-y-4">
                <div className="bg-bg-secondary border border-text-grey rounded-lg p-8 flex flex-col items-center justify-center min-h-64">
                  <QrCode size={48} className="text-blue mb-4" />
                  <p className="text-white text-sm text-center mb-2">
                    Scan QR Code
                  </p>
                  <p className="text-text-grey text-xs text-center">
                    Point your camera at the QR code provided by your lecturer
                  </p>
                  <button className="mt-6 bg-blue hover:opacity-90 text-white py-2 px-6 rounded-md text-sm transition">
                    Open Camera
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-blue font-bold text-xl">
                    {selectedClass.courseCode}
                  </p>
                  {getStatusBadge(
                    selectedClass.status,
                    selectedClass.attendance
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedClass.courseName}
                </h2>
                <p className="text-text-grey text-sm mt-1">
                  Section: {selectedClass.classCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X size={20} className="text-text-grey" />
              </button>
            </div>

            {/* Attendance Overview */}
            <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-text-grey text-sm">Attendance Rate</p>
                  <p
                    className={`text-4xl font-bold ${getAttendanceColor(
                      selectedClass.attendance
                    )}`}
                  >
                    {selectedClass.attendance}%
                  </p>
                </div>
                <TrendingUp
                  size={32}
                  className={getAttendanceColor(selectedClass.attendance)}
                />
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getBarColor(
                    selectedClass.attendance
                  )} transition-all duration-500`}
                  style={{ width: `${selectedClass.attendance}%` }}
                />
              </div>
              <p className="text-text-grey text-sm mt-2">
                {selectedClass.presentDays} of {selectedClass.totalDays} classes
                attended
              </p>
            </div>

            {/* Class Information */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-grey text-xs mb-1">Lecturer</p>
                <p className="text-white font-semibold">
                  {selectedClass.lecturerName}
                </p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-grey text-xs mb-1">Credits</p>
                <p className="text-white font-semibold">
                  {selectedClass.credits}
                </p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-grey text-xs mb-1">Semester</p>
                <p className="text-white font-semibold">
                  {selectedClass.semester}
                </p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-grey text-xs mb-1">Absent Days</p>
                <p className="text-red-500 font-semibold">
                  {selectedClass.totalDays - selectedClass.presentDays}
                </p>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Class Schedule</h3>
              <div className="space-y-3">
                {selectedClass.schedule.map((session, idx) => (
                  <div
                    key={idx}
                    className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-blue" />
                        <span className="text-white font-medium">
                          {session.day}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-text-grey text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{session.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedClass(null)}
              className="w-full bg-blue hover:opacity-90 text-white py-3 rounded-md text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentAttendanceRecord = () => {
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState("month"); // 'week', 'month', 'semester'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Sample attendance data
  const attendanceRecords = [
    {
      id: 1,
      classCode: "COSC333-A",
      courseName: "Compiler Design",
      date: "2024-11-14",
      time: "9:00 AM - 11:00 AM",
      status: "Present",
      markedBy: "Dr. Adewale Ogunleye",
      location: "Lab A1",
      notes: null,
    },
    {
      id: 2,
      classCode: "COSC402-IT",
      courseName: "Database Systems",
      date: "2024-11-13",
      time: "10:00 AM - 12:00 PM",
      status: "Present",
      markedBy: "Prof. Chioma Nwankwo",
      location: "Lab C3",
      notes: null,
    },
    {
      id: 3,
      classCode: "COSC401-CS",
      courseName: "Web Development",
      date: "2024-11-13",
      time: "1:00 PM - 3:00 PM",
      status: "Late",
      markedBy: "Dr. Ibrahim Musa",
      location: "Lab A2",
      notes: "Late - 15 minutes",
    },
    {
      id: 4,
      classCode: "COSC333-A",
      courseName: "Compiler Design",
      date: "2024-11-11",
      time: "9:00 AM - 11:00 AM",
      status: "Present",
      markedBy: "Dr. Adewale Ogunleye",
      location: "Lab A1",
      notes: null,
    },
    {
      id: 5,
      classCode: "COSC360-SE",
      courseName: "UI/UX Design",
      date: "2024-11-12",
      time: "1:00 PM - 2:00 PM",
      status: "Present",
      markedBy: "Mrs. Folake Adewale",
      location: "Lab B1",
      notes: null,
    },
    {
      id: 6,
      classCode: "COSC350-IT",
      courseName: "Computer Networks",
      date: "2024-11-08",
      time: "10:00 AM - 12:00 PM",
      status: "Absent",
      markedBy: "Dr. Yetunde Okafor",
      location: "Room E2",
      notes: "Medical excuse submitted",
    },
    {
      id: 7,
      classCode: "COSC402-IT",
      courseName: "Database Systems",
      date: "2024-11-07",
      time: "1:00 PM - 3:00 PM",
      status: "Present",
      markedBy: "Prof. Chioma Nwankwo",
      location: "Lab C3",
      notes: null,
    },
    {
      id: 8,
      classCode: "COSC401-CS",
      courseName: "Web Development",
      date: "2024-11-08",
      time: "9:00 AM - 11:00 AM",
      status: "Late",
      markedBy: "Dr. Ibrahim Musa",
      location: "Lab A2",
      notes: "Late - 10 minutes",
    },
    {
      id: 9,
      classCode: "COSC333-A",
      courseName: "Compiler Design",
      date: "2024-11-06",
      time: "2:00 PM - 4:00 PM",
      status: "Present",
      markedBy: "Dr. Adewale Ogunleye",
      location: "Lab A1",
      notes: null,
    },
    {
      id: 10,
      classCode: "COSC350-IT",
      courseName: "Computer Networks",
      date: "2024-11-06",
      time: "2:00 PM - 4:00 PM",
      status: "Absent",
      markedBy: "Dr. Yetunde Okafor",
      location: "Room E2",
      notes: null,
    },
    {
      id: 11,
      classCode: "COSC360-SE",
      courseName: "UI/UX Design",
      date: "2024-11-05",
      time: "1:00 PM - 2:00 PM",
      status: "Present",
      markedBy: "Mrs. Folake Adewale",
      location: "Lab B1",
      notes: null,
    },
    {
      id: 12,
      classCode: "COSC402-IT",
      courseName: "Database Systems",
      date: "2024-11-05",
      time: "10:00 AM - 12:00 PM",
      status: "Present",
      markedBy: "Prof. Chioma Nwankwo",
      location: "Lab C3",
      notes: null,
    },
  ];

  const classes = [
    "All Classes",
    "COSC333-A - Compiler Design",
    "COSC402-IT - Database Systems",
    "COSC401-CS - Web Development",
    "COSC360-SE - UI/UX Design",
    "COSC350-IT - Computer Networks",
  ];

  const statuses = ["All Status", "Present", "Absent", "Late"];

  // Filter records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const classMatch =
        selectedClass === "All Classes" ||
        `${record.classCode} - ${record.courseName}` === selectedClass;
      const statusMatch =
        selectedStatus === "All Status" || record.status === selectedStatus;

      const recordDate = new Date(record.date);
      const today = new Date();
      let dateMatch = true;

      if (dateRange === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        dateMatch = recordDate >= weekAgo;
      } else if (dateRange === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        dateMatch = recordDate >= monthAgo;
      }

      return classMatch && statusMatch && dateMatch;
    });
  }, [selectedClass, selectedStatus, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const present = filteredRecords.filter(
      (r) => r.status === "Present"
    ).length;
    const absent = filteredRecords.filter((r) => r.status === "Absent").length;
    const late = filteredRecords.filter((r) => r.status === "Late").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, percentage };
  }, [filteredRecords]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Absent":
        return <XCircle size={16} className="text-red-500" />;
      case "Late":
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-500/20 text-green-500";
      case "Absent":
        return "bg-red-500/20 text-red-500";
      case "Late":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleExport = (format) => {
    // In a real app, this would generate and download the file
    alert(`Exporting attendance report as ${format.toUpperCase()}...`);
    setShowExportMenu(false);
  };

  // Calendar view helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getRecordsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return filteredRecords.filter((r) => r.date === dateString);
  };

  const renderCalendarView = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const records = getRecordsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-24 border border-text-grey/30 rounded ${
            isToday ? "bg-blue/10 border-blue" : "bg-background-grey"
          }`}
        >
          <div className="text-xs text-white font-semibold mb-1">{day}</div>
          <div className="space-y-1">
            {records.map((record) => (
              <div
                key={record.id}
                className={`text-xs px-1 py-0.5 rounded ${getStatusColor(
                  record.status
                )}`}
              >
                {record.classCode}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Attendance Record
          </h1>
          <p className="text-text-grey text-sm mt-1">
            Track your attendance history
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-bg-secondary border border-text-grey text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 hover:border-blue transition"
          >
            <Filter size={18} />
            Filters
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 transition"
            >
              <Download size={18} />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-background-grey border border-text-grey rounded-md shadow-lg z-10 w-40">
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left text-sm p-3 hover:bg-gray-700 transition-colors text-white"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left text-sm p-3 hover:bg-gray-700 transition-colors text-white"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full text-left text-sm p-3 hover:bg-gray-700 transition-colors text-white"
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-background-grey border border-text-grey rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Filter */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Filter by Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0 focus:border-blue transition"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0 focus:border-blue transition"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-text-grey text-sm font-semibold mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-2 rounded-md outline-0 focus:border-blue transition"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="semester">This Semester</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs">Total Sessions</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <p className="text-text-grey text-xs">Present</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {stats.present}
          </p>
        </div>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-text-grey text-xs">Absent</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.absent}</p>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-text-grey text-xs">Late</p>
          <p className="text-2xl font-bold text-yellow-500 mt-1">
            {stats.late}
          </p>
        </div>
        <div className="bg-blue/20 border border-blue rounded-lg p-4">
          <p className="text-text-grey text-xs">Attendance Rate</p>
          <p className="text-2xl font-bold text-blue mt-1">
            {stats.percentage}%
          </p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("list")}
          className={`flex-1 md:flex-initial py-2 px-6 rounded-md text-sm transition ${
            viewMode === "list"
              ? "bg-blue text-white"
              : "bg-bg-secondary text-text-grey"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`flex-1 md:flex-initial py-2 px-6 rounded-md text-sm transition ${
            viewMode === "calendar"
              ? "bg-blue text-white"
              : "bg-bg-secondary text-text-grey"
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="bg-background-grey border border-text-grey rounded-lg p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  )
                )
              }
              className="p-2 hover:bg-gray-700 rounded transition"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <h2 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  )
                )
              }
              className="p-2 hover:bg-gray-700 rounded transition"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-text-grey text-xs font-semibold p-2"
              >
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendarView()}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-background-grey border border-text-grey rounded-lg overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-grey">
                No attendance records found for the selected filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-text-grey/30">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-6 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Side - Class Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-blue font-bold">
                          {record.classCode}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </div>
                      <p className="text-white font-semibold mb-1">
                        {record.courseName}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-grey">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(record.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{record.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{record.markedBy}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Additional Info */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-text-grey">
                        📍 {record.location}
                      </span>
                      {record.notes && (
                        <div className="flex items-start gap-1 bg-yellow-500/10 border border-yellow-500/30 rounded px-3 py-1">
                          <FileText
                            size={12}
                            className="text-yellow-500 mt-0.5"
                          />
                          <span className="text-xs text-yellow-500">
                            {record.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StudentAnalytics = () => {
  const [timeRange, setTimeRange] = useState("month"); // 'week', 'month', 'semester'
  const [selectedMetric, setSelectedMetric] = useState("attendance"); // 'attendance', 'comparison', 'risk'
  const [goalPercentage, setGoalPercentage] = useState(90);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Sample data for charts
  const weeklyData = [
    { week: "Week 1", attendance: 85, classAvg: 82 },
    { week: "Week 2", attendance: 88, classAvg: 83 },
    { week: "Week 3", attendance: 82, classAvg: 84 },
    { week: "Week 4", attendance: 90, classAvg: 85 },
  ];

  const monthlyData = [
    { month: "Aug", attendance: 85, classAvg: 82 },
    { month: "Sep", attendance: 87, classAvg: 83 },
    { month: "Oct", attendance: 86, classAvg: 84 },
    { month: "Nov", attendance: 89, classAvg: 85 },
  ];

  const semesterData = [
    { period: "Month 1", attendance: 85, classAvg: 82 },
    { period: "Month 2", attendance: 87, classAvg: 83 },
    { period: "Month 3", attendance: 86, classAvg: 84 },
    { period: "Month 4", attendance: 89, classAvg: 85 },
  ];

  const peakAttendanceDays = [
    { day: "Monday", sessions: 12, percentage: 95 },
    { day: "Tuesday", sessions: 10, percentage: 88 },
    { day: "Wednesday", sessions: 11, percentage: 92 },
    { day: "Thursday", sessions: 9, percentage: 85 },
    { day: "Friday", sessions: 8, percentage: 78 },
  ];

  const riskAnalysis = [
    {
      course: "COSC 350 - Networks",
      current: 72,
      needed: 13,
      status: "high",
      trend: "declining",
    },
    {
      course: "COSC 401 - Web Dev",
      current: 78,
      needed: 7,
      status: "medium",
      trend: "stable",
    },
    {
      course: "COSC 402 - Database",
      current: 85,
      needed: 0,
      status: "low",
      trend: "improving",
    },
  ];

  const currentData =
    timeRange === "week"
      ? weeklyData
      : timeRange === "month"
      ? monthlyData
      : semesterData;

  const currentAttendance = 87;
  const classAverage = 84;
  const semesterProgress = 65; // percentage through semester

  const getTrendIcon = (trend) => {
    if (trend === "improving")
      return <TrendingUp size={16} className="text-green-500" />;
    if (trend === "declining")
      return <TrendingDown size={16} className="text-red-500" />;
    return <span className="text-yellow-500">→</span>;
  };

  const getRiskColor = (status) => {
    if (status === "high") return "bg-red-500/20 text-red-500 border-red-500";
    if (status === "medium")
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500";
    return "bg-green-500/20 text-green-500 border-green-500";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Analytics & Trends
          </h1>
          <p className="text-text-grey text-sm mt-1">
            Visualize your attendance patterns and progress
          </p>
        </div>
        <button
          onClick={() => setShowGoalModal(true)}
          className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Set Goal
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs mb-1">Current Attendance</p>
          <p className="text-3xl font-bold text-white">{currentAttendance}%</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-green-500 text-xs">+3% from last month</span>
          </div>
        </div>

        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs mb-1">Class Average</p>
          <p className="text-3xl font-bold text-blue">{classAverage}%</p>
          <p className="text-text-grey text-xs mt-1">
            You're {currentAttendance - classAverage}% above average
          </p>
        </div>

        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs mb-1">Semester Progress</p>
          <p className="text-3xl font-bold text-white">{semesterProgress}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-blue transition-all duration-500"
              style={{ width: `${semesterProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs mb-1">Target Goal</p>
          <p className="text-3xl font-bold text-green-500">{goalPercentage}%</p>
          <p className="text-text-grey text-xs mt-1">
            {currentAttendance >= goalPercentage
              ? "Goal achieved! 🎉"
              : `${goalPercentage - currentAttendance}% to go`}
          </p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange("week")}
          className={`flex-1 md:flex-initial py-2 px-6 rounded-md text-sm transition ${
            timeRange === "week"
              ? "bg-blue text-white"
              : "bg-bg-secondary text-text-grey"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setTimeRange("month")}
          className={`flex-1 md:flex-initial py-2 px-6 rounded-md text-sm transition ${
            timeRange === "month"
              ? "bg-blue text-white"
              : "bg-bg-secondary text-text-grey"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimeRange("semester")}
          className={`flex-1 md:flex-initial py-2 px-6 rounded-md text-sm transition ${
            timeRange === "semester"
              ? "bg-blue text-white"
              : "bg-bg-secondary text-text-grey"
          }`}
        >
          Semester
        </button>
      </div>

      {/* Attendance Trend Chart */}
      <div className="bg-background-grey border border-text-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Attendance Trend</h2>
        <div className="space-y-4">
          {currentData.map((item, idx) => {
            const maxValue = Math.max(
              ...currentData.map((d) => Math.max(d.attendance, d.classAvg))
            );
            const yourWidth = (item.attendance / maxValue) * 100;
            const avgWidth = (item.classAvg / maxValue) * 100;

            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-semibold">
                    {item.week || item.month || item.period}
                  </span>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue rounded"></div>
                      <span className="text-text-grey">
                        You: {item.attendance}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-500 rounded"></div>
                      <span className="text-text-grey">
                        Average: {item.classAvg}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-blue transition-all duration-500"
                      style={{ width: `${yourWidth}%` }}
                    />
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-gray-500 transition-all duration-500"
                      style={{ width: `${avgWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peak Attendance Days */}
      <div className="bg-background-grey border border-text-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Peak Attendance by Day
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {peakAttendanceDays.map((day) => (
            <div
              key={day.day}
              className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4 text-center"
            >
              <p className="text-white font-semibold mb-2">{day.day}</p>
              <p
                className={`text-2xl font-bold mb-1 ${
                  day.percentage >= 90
                    ? "text-green-500"
                    : day.percentage >= 75
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {day.percentage}%
              </p>
              <p className="text-text-grey text-xs">{day.sessions} sessions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-background-grey border border-text-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Classes Needing Improvement
        </h2>
        <div className="space-y-4">
          {riskAnalysis.map((course, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-4 ${getRiskColor(course.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">{course.course}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(course.trend)}
                    <span className="text-xs capitalize">{course.trend}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{course.current}%</p>
                  <p className="text-xs uppercase font-semibold">
                    {course.status} risk
                  </p>
                </div>
              </div>
              {course.needed > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-current/30">
                  <span className="text-xs">Classes needed:</span>
                  <span className="text-sm font-bold">
                    {course.needed} more sessions
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Set Attendance Goal
              </h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X size={20} className="text-text-grey" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-text-grey text-sm font-semibold mb-3">
                  Target Attendance Percentage
                </label>
                <input
                  type="range"
                  min="75"
                  max="100"
                  value={goalPercentage}
                  onChange={(e) => setGoalPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-text-grey text-sm">75%</span>
                  <span className="text-blue text-3xl font-bold">
                    {goalPercentage}%
                  </span>
                  <span className="text-text-grey text-sm">100%</span>
                </div>
              </div>

              <div className="bg-blue/10 border border-blue/30 rounded-lg p-4">
                <p className="text-white text-sm mb-2">Goal Progress</p>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      currentAttendance >= goalPercentage
                        ? "bg-green-500"
                        : "bg-blue"
                    }`}
                    style={{
                      width: `${Math.min(
                        (currentAttendance / goalPercentage) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-text-grey text-xs mt-2">
                  Current: {currentAttendance}% / Goal: {goalPercentage}%
                </p>
              </div>

              <button
                onClick={() => {
                  alert(`Goal set to ${goalPercentage}%!`);
                  setShowGoalModal(false);
                }}
                className="w-full bg-blue hover:opacity-90 text-white py-3 rounded-md text-sm transition"
              >
                Set Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'security', 'notifications', 'privacy'
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Adebayo",
    lastName: "Johnson",
    matricNo: "22/3001",
    email: "adebayo.johnson@university.edu",
    phone: "+234 801 234 5678",
    department: "Computer Science",
    level: "400 Level",
    semester: "Fall 2024",
    dateOfBirth: "1999-05-15",
    address: "123 University Road, Lagos",
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
    showAttendanceToClassmates: false,
    showProfileToLecturers: true,
    allowDataAnalytics: true,
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    alert("Password change functionality would open here");
  };

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
              onClick={() => setIsEditing(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData({ ...profileData, lastName: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Matric Number
          </label>
          <input
            type="text"
            value={profileData.matricNo}
            disabled
            className="w-full bg-bg-secondary border border-text-grey text-text-grey text-sm p-3 rounded-md outline-0 opacity-50"
          />
          <p className="text-xs text-text-grey mt-1">Cannot be changed</p>
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
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
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) =>
              setProfileData({ ...profileData, dateOfBirth: e.target.value })
            }
            disabled={!isEditing}
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Department
          </label>
          <input
            type="text"
            value={profileData.department}
            disabled
            className="w-full bg-bg-secondary border border-text-grey text-text-grey text-sm p-3 rounded-md outline-0 opacity-50"
          />
        </div>

        <div>
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Current Level
          </label>
          <input
            type="text"
            value={profileData.level}
            disabled
            className="w-full bg-bg-secondary border border-text-grey text-text-grey text-sm p-3 rounded-md outline-0 opacity-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Address
          </label>
          <textarea
            value={profileData.address}
            onChange={(e) =>
              setProfileData({ ...profileData, address: e.target.value })
            }
            disabled={!isEditing}
            rows="3"
            className="w-full bg-bg-secondary border border-text-grey text-white text-sm p-3 rounded-md outline-0 focus:border-blue transition disabled:opacity-50 resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>

      <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-semibold mb-1">Password</p>
            <p className="text-text-grey text-sm">Last changed 45 days ago</p>
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
        <p className="text-white font-semibold mb-4">Linked Devices</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-text-grey/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-blue text-lg">💻</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  Windows PC - Chrome
                </p>
                <p className="text-text-grey text-xs">
                  Lagos, Nigeria • Active now
                </p>
              </div>
            </div>
            <span className="text-green-500 text-xs">Current</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-text-grey/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-blue text-lg">📱</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  iPhone 13 - Safari
                </p>
                <p className="text-text-grey text-xs">
                  Lagos, Nigeria • 2 hours ago
                </p>
              </div>
            </div>
            <button className="text-red-500 text-xs hover:underline">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-auto">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-black text-xs">!</span>
            </div>
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
        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Class Reminders</p>
              <p className="text-text-grey text-xs mt-1">
                Get notified 30 minutes before class
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.classReminders}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    classReminders: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Attendance Alerts</p>
              <p className="text-text-grey text-xs mt-1">
                Daily attendance status updates
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.attendanceAlerts}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    attendanceAlerts: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">
                Low Attendance Warnings
              </p>
              <p className="text-text-grey text-xs mt-1">
                Alert when attendance drops below 85%
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.lowAttendanceWarnings}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    lowAttendanceWarnings: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">System Updates</p>
              <p className="text-text-grey text-xs mt-1">
                Important system maintenance and updates
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.systemUpdates}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    systemUpdates: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Email Notifications</p>
              <p className="text-text-grey text-xs mt-1">
                Receive notifications via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Push Notifications</p>
              <p className="text-text-grey text-xs mt-1">
                Receive push notifications on your devices
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    pushNotifications: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Privacy Settings</h2>

      <div className="space-y-4">
        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">
                Show Attendance to Classmates
              </p>
              <p className="text-text-grey text-xs mt-1">
                Allow other students in your class to see your attendance record
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.showAttendanceToClassmates}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showAttendanceToClassmates: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">
                Show Profile to Lecturers
              </p>
              <p className="text-text-grey text-xs mt-1">
                Allow lecturers to view your profile information
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.showProfileToLecturers}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showProfileToLecturers: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>

        <div className="bg-bg-secondary border border-text-grey/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Allow Data Analytics</p>
              <p className="text-text-grey text-xs mt-1">
                Help improve the system by sharing anonymous usage data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.allowDataAnalytics}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    allowDataAnalytics: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-blue/10 border border-blue/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-auto">
            <div className="w-5 h-5 bg-blue rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">i</span>
            </div>
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
          {["personal", "security", "notifications", "privacy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue text-white"
                  : "text-text-grey hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-bg-secondary rounded-lg p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

const StudentOverviewCards = {
  StudentWelcomeCard,
  OverallAttendanceCard,
  QuickStatsCards,
  NotificationsPanel,
  ClassAttendanceBreakdown,
  TodaysClassesCard,
  StudentClassesView,
  StudentAttendanceRecord,
  StudentAnalytics,
  StudentProfile,
};

export default StudentOverviewCards;
