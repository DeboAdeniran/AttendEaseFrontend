import React from "react";
import Notification from "../../assets/notification.svg?react";
import DashStatus from "../../assets/close.svg?react";
import Main from "../../assets/main.svg?react";
import Settings from "../../assets/settings.svg?react";
import Logout from "../../assets/logout.svg?react";
import Course from "../../assets/course.svg?react";
import Guard from "../../assets/guard.svg?react";
import Class from "../../assets/class.svg?react";
import Person from "../../assets/student.svg?react";
import Attendance from "../../assets/attendance.svg?react";
import Demarcation from "../../assets/demarcation.svg?react";
import Analysis from "../../assets/analysis.svg?react";
import { Link, useSearchParams, useLocation } from "react-router-dom";

const DashboardSidebar = ({ isOpen, onClose }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentTab = searchParams.get("tab") || "overview";

  // Detect if we're on student or lecturer dashboard
  const isLecturerDashboard = location.pathname.includes("/lecturer-dashboard");
  const dashboardPath = isLecturerDashboard
    ? "/lecturer-dashboard"
    : "/student-dashboard";

  const isActive = (tab) => currentTab === tab;

  // Sidebar navigation items configuration
  const navItems = [
    {
      id: "overview",
      icon: Main,
      label: "Overview",
      show: true,
    },
    {
      id: "attendance",
      icon: Attendance,
      label: "Attendance",
      show: true,
    },
    {
      id: "course",
      icon: Course,
      label: "Courses",
      show: isLecturerDashboard,
    },
    {
      id: "analytics",
      icon: Analysis,
      label: "Analytics",
      show: !isLecturerDashboard,
    },
    {
      id: "class",
      icon: Class,
      label: "Classes",
      show: true,
    },
    {
      id: "students",
      icon: Person,
      label: "Students",
      show: isLecturerDashboard,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-background-grey h-full flex items-center justify-between flex-col py-8 lg:py-4 gap-4 
          fixed  top-0 left-0 z-50 w-16
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="w-full flex items-center flex-col gap-24">
          <div className="w-full flex items-center flex-col gap-8">
            <Notification className="w-6 h-6" />
          </div>
          <div className="w-full flex items-center flex-col gap-8">
            <div className="w-full flex items-center flex-col gap-8 ">
              {navItems.map(
                (item) =>
                  item.show && (
                    <Link
                      key={item.id}
                      to={`${dashboardPath}?tab=${item.id}`}
                      className="w-full flex justify-center items-center relative group "
                      onClick={() => {
                        // Close sidebar on mobile when link is clicked
                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                    >
                      {isActive(item.id) && (
                        <div className="absolute right-0 w-1 h-8 bg-blue rounded-r-full"></div>
                      )}
                      <item.icon
                        className={`w-6 h-6 ${
                          isActive(item.id) ? "text-blue" : "text-white/50"
                        }`}
                      />
                      {/* Tooltip */}
                      <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.label}
                      </div>
                    </Link>
                  )
              )}
              <Demarcation className="w-full" />
            </div>
            <div className="w-full flex items-center flex-col gap-8">
              <Link
                to={`${dashboardPath}?tab=profile`}
                className="w-full flex justify-center items-center relative group"
              >
                {isActive("profile") && (
                  <div className="absolute right-0 w-1 h-8 bg-blue rounded-r-full"></div>
                )}
                <Settings
                  className={`w-6 h-6 ${
                    isActive("profile") ? "text-blue" : "text-white"
                  }`}
                />
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Profile
                </div>
              </Link>
              <button className="w-full flex justify-center items-center p-2 rounded-md hover:bg-gray-700 transition-colors group">
                <Guard className="w-6 h-6 text-white" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Security
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center flex-col gap-8">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center p-2 rounded-md hover:bg-gray-700 transition-colors group"
          >
            <Logout className="w-6 h-6 text-white" />
            <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Logout
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
