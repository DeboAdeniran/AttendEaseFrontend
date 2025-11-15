/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import Sun from "../../assets/sun.svg?react";
import Positive from "../../assets/positive.svg?react";
import Negative from "../../assets/Negative.svg?react";
import { ChevronDown, Search, Plus, X, Edit2, Archive } from "lucide-react";

const RealTimeDisplay = () => {
  const [now, setNow] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState("COSC 333");
  const [isOpen, setIsOpen] = useState(false);

  const courses = [
    "COSC 333",
    "COSC 201",
    "COSC 402",
    "MATH 301",
    "ENG 205",
    "PHY 101",
  ];

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

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedTime = now.toLocaleTimeString("en-US", options);
  const formattedDate = now.toLocaleDateString("en-GB", dateOptions);

  return (
    <div className="bg-background-grey p-6 gap-24 flex flex-col rounded-md w-full md:w-72">
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
            className="w-full bg-blue text-xs p-2 rounded-md flex items-center justify-between"
          >
            {selectedCourse}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <div className="absolute top-full mt-1 w-full bg-background-grey border border-gray-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left text-xs p-2 hover:bg-gray-700 transition-colors ${
                    selectedCourse === course ? "bg-blue" : ""
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OverViewDetailsCard = () => {
  const overViewData = [
    {
      title: "Total Students",
      value: "452",
      info: "+2 new student joined!",
      change: "positive",
    },
    {
      title: "Present Today",
      value: "387",
      info: "+85% attendance rate!",
      change: "positive",
    },
    {
      title: "Absent Today",
      value: "65",
      info: "-15% of total students!",
      change: "negative",
    },
    {
      title: "Late Arrivals",
      value: "23",
      info: "-5% of total students!",
      change: "negative",
    },
    {
      title: "Classes Today",
      value: "8",
      info: "+3 classes completed!",
      change: "positive",
    },
    {
      title: "Average Attendance",
      value: "87%",
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
      {overViewData.map((data, index) => (
        <div
          key={index}
          className="bg-background-grey p-6 rounded-md w-full md:w-72 flex flex-col gap-2  "
        >
          <p className="text-3xl font-bold">{data.value}</p>
          <p className="text-sm">{data.title}</p>
          <div className="flex gap-2">
            {getChangeIcon(data.change)}
            <p className="text-xs text-text-grey ">{data.info} </p>
          </div>
        </div>
      ))}
    </>
  );
};

const DashboardAttendanceOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("29 July 2023");

  const attendanceData = [
    {
      matricNo: "22/0451",
      name: "Adebayo Oluwaseun",
      department: "Computer Science",
      date: "29 July 2023",
      status: "Present",
      percentage: "95%",
    },
    {
      matricNo: "22/0832",
      name: "Chioma Nwankwo",
      department: "Engineering",
      date: "29 July 2023",
      status: "Present",
      percentage: "78%",
    },
    {
      matricNo: "22/1203",
      name: "Emeka Okafor",
      department: "Medicine",
      date: "29 July 2023",
      status: "Late",
      percentage: "88%",
    },
    {
      matricNo: "22/0674",
      name: "Fatima Abdullahi",
      department: "Law",
      date: "29 July 2023",
      status: "Present",
      percentage: "92%",
    },
    {
      matricNo: "22/1487",
      name: "Ibrahim Musa",
      department: "Business Administration",
      date: "29 July 2023",
      status: "Absent",
      percentage: "85%",
    },
    {
      matricNo: "22/0925",
      name: "Ngozi Eze",
      department: "Computer Science",
      date: "29 July 2023",
      status: "Present",
      percentage: "91%",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-500/20 text-green-500 ";
      case "Absent":
        return "bg-red-500/20 text-red-500";
      case "Late":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPercentageColor = (percentage) => {
    const value = parseInt(percentage);
    if (value >= 90) return "text-green-500";
    if (value >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const filteredData = attendanceData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="bg-background-grey p-6 rounded-md min-h-screen">
      <div className="flex flex-col md:flex-row justify-center md:items-center gap-4 md:gap-10 py-6">
        <p className="w-auto shrink-0 text-xl ">Attendance Overview</p>
        <div className="w-full h-full rounded-md border border-text-grey flex py-3 px-4">
          <input
            className=" w-full h-full text-secondary-white bg-bg-secondary outline-0 border-0"
            placeholder="Quick Search..."
          />
          {/* <SearchButton /> */}
        </div>
      </div>

      <table className="block md:table w-full overflow-x-auto">
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
              Date
            </th>
            <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
              Status
            </th>
            <th className="text-left text-text-grey font-medium px-6 py-4 text-sm">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((student, index) => (
            <tr
              key={index}
              className="border-b border-gray-700 hover:bg-gray-750"
            >
              <td className="px-6 py-4 text-white text-sm">
                {student.matricNo}
              </td>
              <td className="px-6 py-4 text-white text-sm">{student.name}</td>
              <td className="px-6 py-4 text-text-grey text-sm">
                {student.department}
              </td>
              <td className="px-6 py-4 text-text-grey text-sm">
                {student.date}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                    student.status
                  )}`}
                >
                  {student.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-sm font-semibold ${getPercentageColor(
                    student.percentage
                  )}`}
                >
                  {student.percentage}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
// FOR ATTENDANCE TABLE

const initialAttendanceData = [
  {
    id: 1,
    matricNo: "22/3001",
    name: "Adeboye Johnson",
    department: "Computer Science",
    absentDays: 2,
    percentage: 92,
  },
  {
    id: 2,
    matricNo: "22/3002",
    name: "Folake Adewale",
    department: "Software Engineering",
    absentDays: 5,
    percentage: 75,
  },
  {
    id: 3,
    matricNo: "22/3003",
    name: "Chinedu Okoro",
    department: "Computer Science",
    absentDays: 1,
    percentage: 96,
  },
  {
    id: 4,
    matricNo: "22/3004",
    name: "Bolanle Hassan",
    department: "Information Technology",
    absentDays: 3,
    percentage: 85,
  },
  {
    id: 5,
    matricNo: "22/1205",
    name: "Tunde Babalola",
    department: "Software Engineering",
    absentDays: 0,
    percentage: 100,
  },
  {
    id: 6,
    matricNo: "22/1306",
    name: "Adebisi Ogunleye",
    department: "Computer Science",
    absentDays: 1,
    percentage: 94,
  },
  {
    id: 7,
    matricNo: "22/1307",
    name: "Chiamaka Nwosu",
    department: "Information Technology",
    absentDays: 4,
    percentage: 78,
  },
  {
    id: 8,
    matricNo: "22/3008",
    name: "Olufemi Adeyemi",
    department: "Software Engineering",
    absentDays: 2,
    percentage: 89,
  },
  {
    id: 9,
    matricNo: "22/1239",
    name: "Modupe Alabi",
    department: "Computer Science",
    absentDays: 3,
    percentage: 82,
  },
  {
    id: 10,
    matricNo: "22/1301",
    name: "Segun Odunfa",
    department: "Information Technology",
    absentDays: 1,
    percentage: 93,
  },
  {
    id: 11,
    matricNo: "22/3011",
    name: "Aminat Suleiman",
    department: "Software Engineering",
    absentDays: 0,
    percentage: 100,
  },
  {
    id: 12,
    matricNo: "22/1232",
    name: "Oluwaseun Balogun",
    department: "Computer Science",
    absentDays: 6,
    percentage: 65,
  },
  {
    id: 13,
    matricNo: "22/1233",
    name: "Kafilat Ajayi",
    department: "Information Technology",
    absentDays: 2,
    percentage: 88,
  },
  {
    id: 14,
    matricNo: "22/1304",
    name: "Ibrahim Musa",
    department: "Software Engineering",
    absentDays: 4,
    percentage: 76,
  },
  {
    id: 15,
    matricNo: "22/5015",
    name: "Yetunde Okafor",
    department: "Computer Science",
    absentDays: 1,
    percentage: 94,
  },
];

const AttendanceTable = () => {
  const [selectedClass, setSelectedClass] = useState("COSC 333 - CS A");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Add default status of "-" to all students
  const [attendanceData, setAttendanceData] = useState(
    initialAttendanceData.map((student) => ({ ...student, status: "-" }))
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classes = [
    "COSC 333 - CS A",
    "COSC 333 - CS B",
    "COSC 402 - IT",
    "COSC 333 - SE A",
  ];

  // Only 3 status options as requested
  const statusOptions = ["Present", "Absent", "Excused"];

  const filteredData = attendanceData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (studentId, newStatus) => {
    setHasUnsavedChanges(true);
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status: newStatus,
              absentDays:
                newStatus === "Absent"
                  ? student.absentDays + 1
                  : student.absentDays,
              percentage:
                newStatus === "Absent"
                  ? Math.max(
                      0,
                      Math.round(((15 - (student.absentDays + 1)) / 15) * 100)
                    )
                  : student.percentage,
            }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setHasUnsavedChanges(true);
    setAttendanceData((prevData) =>
      prevData.map((student) => ({
        ...student,
        status: "Present",
      }))
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Check if any student still has default "-" status
    const hasUnmarkedStudents = attendanceData.some(
      (student) => student.status === "-"
    );
    if (hasUnmarkedStudents) {
      if (
        !window.confirm(
          "Some students are still unmarked. Are you sure you want to submit?"
        )
      ) {
        setIsSubmitting(false);
        return;
      }
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send this data to your backend
      const submissionData = {
        class: selectedClass,
        date: selectedDate,
        attendance: attendanceData.map((student) => ({
          matricNo: student.matricNo,
          name: student.name,
          status: student.status,
        })),
      };

      console.log("Submitting attendance data:", submissionData);

      // Show success message
      alert(
        `Attendance for ${selectedClass} on ${selectedDate} submitted successfully!`
      );
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Error submitting attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    present: attendanceData.filter((s) => s.status === "Present").length,
    absent: attendanceData.filter((s) => s.status === "Absent").length,
    excused: attendanceData.filter((s) => s.status === "Excused").length,
    unmarked: attendanceData.filter((s) => s.status === "-").length,
    total: attendanceData.length,
  };

  return (
    <div className="bg-background-grey p-6 rounded-md min-h-screen">
      <div className="flex flex-col md:flex-row justify-center md:items-center gap-4 md:gap-10 py-6">
        <p className="w-auto shrink-0 text-xl">Attendance Overview</p>

        <div className="w-full h-full rounded-md border border-text-grey flex py-3 px-4">
          <input
            className="w-full h-full text-secondary-white bg-bg-secondary outline-0 border-0"
            placeholder="Quick Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-auto shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-blue text-xs p-2 rounded-md flex items-center justify-between"
          >
            {selectedClass}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <div className="absolute top-full mt-1 w-full bg-background-grey border border-gray-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {classes.map((course) => (
                <button
                  key={course}
                  onClick={() => {
                    setSelectedClass(course);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left text-xs p-2 hover:bg-gray-700 transition-colors ${
                    selectedClass === course ? "bg-blue" : ""
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-text-grey">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-bg-secondary text-secondary-white p-2 rounded-md border border-text-grey"
          />
        </div>

        <div className="flex gap-2 w-auto shrink-0">
          <button
            onClick={markAllPresent}
            className="w-auto shrink-0 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSubmit}
            disabled={!hasUnsavedChanges || isSubmitting}
            className={`py-2 px-6 rounded-md text-sm transition-colors ${
              hasUnsavedChanges && !isSubmitting
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
              "Submit"
            )}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-md">
          <p className="text-yellow-500 text-sm flex items-center gap-2">
            <ExclamationIcon />
            You have unsaved changes. Don't forget to submit your attendance.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue/20 p-4 rounded-lg">
          <p className="text-sm text-text-grey">Total Students</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-500/20 p-4 rounded-lg">
          <p className="text-sm text-text-grey">Present</p>
          <p className="text-2xl font-bold text-green-500">{stats.present}</p>
        </div>
        <div className="bg-red-500/20 p-4 rounded-lg">
          <p className="text-sm text-text-grey">Absent</p>
          <p className="text-2xl font-bold text-red-500">{stats.absent}</p>
        </div>
        <div className="bg-purple-500/20 p-4 rounded-lg">
          <p className="text-sm text-text-grey">Excused</p>
          <p className="text-2xl font-bold text-purple-500">{stats.excused}</p>
        </div>
        <div className="bg-gray-500/20 p-4 rounded-lg">
          <p className="text-sm text-text-grey">Unmarked</p>
          <p className="text-2xl font-bold text-gray-400">{stats.unmarked}</p>
        </div>
      </div>

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
                Absent Days
              </th>
              <th className="text-center text-text-grey font-medium px-6 py-4 text-sm">
                Percentage
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
                    className={`text-sm px-3 py-1 rounded-md border-0 outline-0 ${
                      student.status === "Present"
                        ? "bg-green-500/20 text-green-500"
                        : student.status === "Absent"
                        ? "bg-red-500/20 text-red-500"
                        : student.status === "Excused"
                        ? "bg-purple-500/20 text-purple-500"
                        : "bg-gray-500/20 text-gray-400" // Default grey for "-"
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
                        ? "text-green-500"
                        : student.percentage >= 75
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                  >
                    {student.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-text-grey">
            No students found matching your search.
          </div>
        )}
      </div>
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

// END FOR ATTENDANCE TABLE

const ClassTimeTable = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timeSlots = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "1:00",
    "2:00",
    "3:00",
    "4:00",
    "5:00",
    "6:00",
  ];
  const classes = [
    {
      id: 1,
      name: "COSC 333 - CS A",
      course: "Compiler Design",
      day: "Monday",
      startTime: "9:00",
      endTime: "11:00",
      location: "Lab A1",
    },
    {
      id: 2,
      name: "COSC 333 - CS B",
      course: "Data Structures",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "12:00",
      location: "Hall B2",
    },
    {
      id: 3,
      name: "COSC 402 - IT",
      course: "Database Systems",
      day: "Wednesday",
      startTime: "1:00",
      endTime: "3:00",
      location: "Lab C3",
    },
    {
      id: 4,
      name: "COSC 333 - SE A",
      course: "Software Engineering",
      day: "Thursday",
      startTime: "2:00",
      endTime: "4:00",
      location: "Room D1",
    },
    {
      id: 5,
      name: "COSC 401 - CS",
      course: "Web Development",
      day: "Monday",
      startTime: "1:00",
      endTime: "3:00",
      location: "Lab A2",
    },
    {
      id: 6,
      name: "COSC 350 - IT",
      course: "Networks",
      day: "Friday",
      startTime: "10:00",
      endTime: "12:00",
      location: "Room E2",
    },
    {
      id: 7,
      name: "COSC 360 - SE",
      course: "UI/UX Design",
      day: "Tuesday",
      startTime: "1:00",
      endTime: "2:00",
      location: "Lab B1",
    },
  ];
  const getTimeIndex = (time) => {
    return timeSlots.indexOf(time);
  };

  const getLeftPosition = (startTime) => {
    return (getTimeIndex(startTime) / timeSlots.length) * 100;
  };

  const getWidth = (startTime, endTime) => {
    const startIdx = getTimeIndex(startTime);
    const endIdx = getTimeIndex(endTime);
    return ((endIdx - startIdx) / timeSlots.length) * 100;
  };

  const getTopPosition = (dayIndex) => {
    return dayIndex * 120;
  };
  return (
    <div className="bg-background-grey p-6 rounded-md min-h-screen">
      <div className="flex flex-row justify-between md:items-center gap-4 md:gap-10 py-6">
        <p className="w-auto shrink-0 text-xl ">Class Overview</p>
        <button
          // onClick={markAllPresent}
          className="w-auto shrink-0 bg-blue hover:bg-blue-800 text-white py-2 px-4 rounded-md text-sm transition-colors"
        >
          Add Class
        </button>
      </div>
      <div className="rounded-md overflow-scroll md:overflow-hidden border border-text-grey">
        {/* Time axis header */}
        <div className="flex border-b-2 border-text-grey">
          <div className="w-40 border-r-2 border-text-grey py-4 px-4">
            <p className="text-sm font-bold text-secondary-white">
              Time Schedule
            </p>
          </div>
          <div className="flex-1 relative text-text-grey">
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
      </div>
      <div className="relative">
        {daysOfWeek.map((day, dayIdx) => (
          <div key={day} className="flex border-b border-text-grey min-h-32">
            {/* Day label */}
            <div className="w-40 border-r-2 border-text-grey  p-4 flex items-start">
              <div>
                <p className="font-bold text-secondary-white">{day}</p>
                {/* <p className="text-xs text-secondary-white mt-1">
                  {new Date(2024, 0, 1 + dayIdx).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p> */}
              </div>
            </div>

            {/* Time grid and class blocks */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="flex h-32 absolute w-full">
                {timeSlots.map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 border-r border-text-grey"
                  ></div>
                ))}
              </div>
              {/* Class blocks */}
              <div className="relative h-32">
                {classes
                  .filter((cls) => cls.day === day)
                  .map((cls) => {
                    const leftPos = getLeftPosition(cls.startTime);
                    const width = getWidth(cls.startTime, cls.endTime);

                    return (
                      <div
                        key={cls.id}
                        className={`absolute bg-blue rounded-md p-3 shadow-md hover:shadow-xl hover:bg-blue/20 transition-shadow cursor-pointer group h-24 flex flex-col justify-between overflow-hidden`}
                        style={{
                          left: `${leftPos}%`,
                          width: `${width}%`,
                          top: "4px",
                          bottom: "4px",
                        }}
                        title={`${cls.name}\n${cls.course}\n${cls.startTime} - ${cls.endTime}\n📍 ${cls.location}`}
                      >
                        <div>
                          <p className="text-xs font-bold text-secondary-white leading-tight">
                            {cls.name}
                          </p>
                          <p className="text-xs text-secondary-white leading-tight">
                            {cls.course}
                          </p>
                        </div>
                        <div className="text-xs text-secondary-white">
                          <p className="leading-tight">
                            {cls.startTime} - {cls.endTime}
                          </p>
                          <p className="leading-tight">📍 {cls.location}</p>
                        </div>

                        {/* Tooltip on hover */}
                        <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 bg-gray-900 text-white p-3 rounded-lg text-xs z-50 whitespace-nowrap shadow-lg">
                          <div className="font-bold">{cls.name}</div>
                          <div>{cls.course}</div>
                          <div className="mt-1">
                            {cls.startTime} - {cls.endTime}
                          </div>
                          <div>📍 {cls.location}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClassCard = () => {
  const classes = [
    {
      id: 1,
      name: "COSC 333 - CS A",
      course: "Compiler Design",
      day: "Monday",
      startTime: "9:00",
      endTime: "11:00",
      location: "Lab A1",
    },
    {
      id: 2,
      name: "COSC 333 - CS B",
      course: "Data Structures",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "12:00",
      location: "Hall B2",
    },
    {
      id: 3,
      name: "COSC 402 - IT",
      course: "Database Systems",
      day: "Wednesday",
      startTime: "1:00",
      endTime: "3:00",
      location: "Lab C3",
    },
    {
      id: 4,
      name: "COSC 333 - SE A",
      course: "Software Engineering",
      day: "Thursday",
      startTime: "2:00",
      endTime: "4:00",
      location: "Room D1",
    },
    {
      id: 5,
      name: "COSC 401 - CS",
      course: "Web Development",
      day: "Monday",
      startTime: "1:00",
      endTime: "3:00",
      location: "Lab A2",
    },
    {
      id: 6,
      name: "COSC 350 - IT",
      course: "Networks",
      day: "Friday",
      startTime: "10:00",
      endTime: "12:00",
      location: "Room E2",
    },
    {
      id: 7,
      name: "COSC 360 - SE",
      course: "UI/UX Design",
      day: "Tuesday",
      startTime: "1:00",
      endTime: "2:00",
      location: "Lab B1",
    },
  ];
  return (
    <div className=" flex flex-wrap gap-6">
      {classes.map((cls) => (
        <div
          key={cls.id}
          className="flex items-center gap-2 bg-background-grey p-4 rounded-md w-full md:w-56 h-fit "
        >
          <div className={`w-4 h-4 rounded bg-blue`}></div>
          <div className="flex flex-col gap-1">
            <div className="text-xs  font-semibold text-secondary-white">
              {cls.name}
            </div>
            <div className="text-xs text-text-grey">{cls.course}</div>
            <div className="text-xs text-text-grey">
              {cls.startTime} - {cls.endTime}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const initialStudentData = [
  {
    id: 1,
    matricNo: "22/3001",
    name: "Adeboye Johnson",
    department: "Computer Science",
    absentDays: 2,
    percentage: 92,
  },
  {
    id: 2,
    matricNo: "22/3002",
    name: "Folake Adewale",
    department: "Software Engineering",
    absentDays: 5,
    percentage: 75,
  },
  {
    id: 3,
    matricNo: "22/3003",
    name: "Chinedu Okoro",
    department: "Computer Science",
    absentDays: 1,
    percentage: 96,
  },
  {
    id: 4,
    matricNo: "22/3004",
    name: "Bolanle Hassan",
    department: "Information Technology",
    absentDays: 3,
    percentage: 85,
  },
  {
    id: 5,
    matricNo: "22/1205",
    name: "Tunde Babalola",
    department: "Software Engineering",
    absentDays: 0,
    percentage: 100,
  },
  {
    id: 6,
    matricNo: "22/1306",
    name: "Adebisi Ogunleye",
    department: "Computer Science",
    absentDays: 1,
    percentage: 94,
  },
  {
    id: 7,
    matricNo: "22/1307",
    name: "Chiamaka Nwosu",
    department: "Information Technology",
    absentDays: 4,
    percentage: 78,
  },
  {
    id: 8,
    matricNo: "22/3008",
    name: "Olufemi Adeyemi",
    department: "Software Engineering",
    absentDays: 2,
    percentage: 89,
  },
  {
    id: 9,
    matricNo: "22/1239",
    name: "Modupe Alabi",
    department: "Computer Science",
    absentDays: 3,
    percentage: 82,
  },
  {
    id: 10,
    matricNo: "22/1301",
    name: "Segun Odunfa",
    department: "Information Technology",
    absentDays: 1,
    percentage: 93,
  },
  {
    id: 11,
    matricNo: "22/3011",
    name: "Aminat Suleiman",
    department: "Software Engineering",
    absentDays: 0,
    percentage: 100,
  },
  {
    id: 12,
    matricNo: "22/1232",
    name: "Oluwaseun Balogun",
    department: "Computer Science",
    absentDays: 6,
    percentage: 65,
  },
  {
    id: 13,
    matricNo: "22/1233",
    name: "Kafilat Ajayi",
    department: "Information Technology",
    absentDays: 2,
    percentage: 88,
  },
  {
    id: 14,
    matricNo: "22/1304",
    name: "Ibrahim Musa",
    department: "Software Engineering",
    absentDays: 4,
    percentage: 76,
  },
  {
    id: 15,
    matricNo: "22/5015",
    name: "Yetunde Okafor",
    department: "Computer Science",
    absentDays: 1,
    percentage: 94,
  },
];

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [minAbsentDays, setMinAbsentDays] = useState(0);
  const [maxAbsentDays, setMaxAbsentDays] = useState(10);
  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(100);
  const [departmentOpen, setDepartmentOpen] = useState(false);

  // Get unique departments
  const departments = [
    "All",
    ...new Set(initialStudentData.map((s) => s.department)),
  ];

  // Filter students based on all criteria
  const filteredStudents = useMemo(() => {
    return initialStudentData.filter((student) => {
      // Search filter (matric number or name)
      const searchMatch =
        student.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Department filter
      const deptMatch =
        selectedDepartment === "All" ||
        student.department === selectedDepartment;

      // Absent days filter
      const absentMatch =
        student.absentDays >= minAbsentDays &&
        student.absentDays <= maxAbsentDays;

      // Percentage filter
      const percentMatch =
        student.percentage >= minPercentage &&
        student.percentage <= maxPercentage;

      return searchMatch && deptMatch && absentMatch && percentMatch;
    });
  }, [
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
        {/* Search Bar */}
        <div className="mb-6">
          <label className="block text-text-grey text-sm font-semibold mb-2">
            Search by Matric Number or Name
          </label>
          <div className="flex items-center gap-2 bg-bg-secondary border border-text-grey rounded-md px-4 py-2">
            <Search size={18} className="text-text-grey" />
            <input
              type="text"
              placeholder="e.g., 22/3001 or Adeboye Johnson"
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
                {selectedDepartment}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
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
              Percentage Range
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
              <p className="text-text-grey text-xs">Total Results</p>
              <p className="text-2xl font-bold text-blue">
                {filteredStudents.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
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
                <th className="text-center text-text-grey font-semibold px-6 py-4 text-sm">
                  Absent Days
                </th>
                <th className="text-center text-text-grey font-semibold px-6 py-4 text-sm">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
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
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-grey text-sm">
              No students found matching your filters
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-background-grey border border-text-grey rounded-lg p-4">
          <p className="text-text-grey text-xs font-semibold">Total Students</p>
          <p className="text-2xl font-bold text-white mt-2">
            {initialStudentData.length}
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
          <p className="text-text-grey text-xs font-semibold">Avg Attendance</p>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {filteredStudents.length > 0
              ? Math.round(
                  filteredStudents.reduce((sum, s) => sum + s.percentage, 0) /
                    filteredStudents.length
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
                  filteredStudents.reduce((sum, s) => sum + s.absentDays, 0) /
                  filteredStudents.length
                ).toFixed(1)
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

// FOR CLASSES
const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      courseCode: "COSC 333",
      courseName: "Compiler Design",
      description: "Study of compiler construction and design principles",
      credits: 3,
      semester: "Fall 2024",
      enrollmentCount: 45,
      attendanceRate: 87,
      classCount: 2,
      archived: false,
    },
    {
      id: 2,
      courseCode: "COSC 402",
      courseName: "Database Systems",
      description: "Fundamentals of relational and NoSQL databases",
      credits: 4,
      semester: "Fall 2024",
      enrollmentCount: 52,
      attendanceRate: 82,
      classCount: 1,
      archived: false,
    },
    {
      id: 3,
      courseCode: "COSC 201",
      courseName: "Data Structures",
      description: "Core data structures and algorithms",
      credits: 3,
      semester: "Spring 2024",
      enrollmentCount: 38,
      attendanceRate: 91,
      classCount: 2,
      archived: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    description: "",
    credits: "",
    semester: "",
  });

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        !course.archived &&
        (course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [courses, searchTerm]);

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        courseCode: course.courseCode,
        courseName: course.courseName,
        description: course.description,
        credits: course.credits,
        semester: course.semester,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        courseCode: "",
        courseName: "",
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
  };

  const handleSubmit = () => {
    if (
      !formData.courseCode ||
      !formData.courseName ||
      !formData.credits ||
      !formData.semester
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingCourse) {
      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id ? { ...course, ...formData } : course
        )
      );
      alert("Course updated successfully!");
    } else {
      const newCourse = {
        id: Math.max(...courses.map((c) => c.id), 0) + 1,
        ...formData,
        credits: parseInt(formData.credits),
        enrollmentCount: 0,
        attendanceRate: 0,
        classCount: 0,
        archived: false,
      };
      setCourses([...courses, newCourse]);
      alert("Course created successfully!");
    }

    handleCloseModal();
  };

  const handleArchiveCourse = (courseId) => {
    if (window.confirm("Are you sure you want to archive this course?")) {
      setCourses(
        courses.map((course) =>
          course.id === courseId ? { ...course, archived: true } : course
        )
      );
    }
  };

  return (
    <div className="bg-background-grey p-8 rounded-md min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Course Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add New Course
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Courses Grid */}
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
                  {course.courseCode}
                </p>
                <p className="text-white font-semibold text-sm mt-1">
                  {course.courseName}
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
              </div>
            </div>

            <p className="text-text-grey text-xs mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-text-grey/30">
              <div>
                <p className="text-text-grey text-xs">Credits</p>
                <p className="text-white font-semibold">{course.credits}</p>
              </div>
              <div>
                <p className="text-text-grey text-xs">Semester</p>
                <p className="text-white font-semibold text-sm">
                  {course.semester}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-text-grey text-xs">Enrolled</p>
                <p className="text-blue font-bold">{course.enrollmentCount}</p>
              </div>
              <div>
                <p className="text-text-grey text-xs">Attendance</p>
                <p
                  className={`font-bold ${
                    course.attendanceRate >= 85
                      ? "text-green-500"
                      : course.attendanceRate >= 70
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {course.attendanceRate}%
                </p>
              </div>
              <div>
                <p className="text-text-grey text-xs">Classes</p>
                <p className="text-white font-bold">{course.classCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-grey">
            No courses found matching your search
          </p>
        </div>
      )}

      {/* Add/Edit Course Modal */}
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

            <div className="space-y-4">
              <div>
                <label className="block text-text-grey text-sm font-semibold mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g., COSC 333"
                  value={formData.courseCode}
                  onChange={(e) =>
                    setFormData({ ...formData, courseCode: e.target.value })
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
                  value={formData.courseName}
                  onChange={(e) =>
                    setFormData({ ...formData, courseName: e.target.value })
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
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue hover:opacity-90 text-white py-2 px-4 rounded-md text-sm transition"
                >
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-grey border border-text-grey rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue font-bold text-lg">
                  {selectedCourse.courseCode}
                </p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedCourse.courseName}
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
              {selectedCourse.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Credits</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.credits}
                </p>
              </div>
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Semester</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.semester}
                </p>
              </div>
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Enrolled Students</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.enrollmentCount}
                </p>
              </div>
              <div className="bg-blue/20 border border-blue rounded-lg p-3">
                <p className="text-text-grey text-xs">Classes</p>
                <p className="text-white font-bold text-lg mt-1">
                  {selectedCourse.classCount}
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
                      selectedCourse.attendanceRate >= 85
                        ? "bg-green-500"
                        : selectedCourse.attendanceRate >= 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${selectedCourse.attendanceRate}%` }}
                  ></div>
                </div>
                <span
                  className={`font-bold ${
                    selectedCourse.attendanceRate >= 85
                      ? "text-green-500"
                      : selectedCourse.attendanceRate >= 70
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedCourse.attendanceRate}%
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

const LecturerOverviewCards = {
  RealTimeDisplay,
  OverViewDetailsCard,
  DashboardAttendanceOverview,
  AttendanceTable,
  ClassTimeTable,
  ClassCard,
  StudentManagement,
  CourseManagement,
};

export default LecturerOverviewCards;
