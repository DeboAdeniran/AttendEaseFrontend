import React, { useState } from "react";
import DashboardSidebar from "../components/ui/DashboardSidebar";
import LecturerDashboardLayout from "../components/layout/LecturerDashboardLayout";
import AuthDebugComponent from "../components/layout/AuthDebugComponent";
import CourseDebugComponent from "../components/layout/CourseDebugComponent";

const LecturerDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="h-screen md:flex md:gap-8 lg:gap-8">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="hidden md:flex w-10" />

        <LecturerDashboardLayout
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      {/* Temporary debug component - remove after fixing */}
      {/* <AuthDebugComponent /> */}
      {/* <CourseDebugComponent /> */}
    </>
  );
};

export default LecturerDashboardPage;
