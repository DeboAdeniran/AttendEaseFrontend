import React, { useState } from "react";
import DashboardSidebar from "../components/ui/DashboardSidebar";
import StudentDashboardLayout from "../components/layout/StudentDashboardLayout";

import AuthDebugComponent from "../components/layout/AuthDebugComponent";
import CourseDebugComponent from "../components/layout/CourseDebugComponent";

const StudentDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className=" h-screen md:flex md:gap-8 lg:gap-8 ">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="hidden md:flex w-10" />
        <StudentDashboardLayout
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      {/* <AuthDebugComponent /> */}
      {/* <CourseDebugComponent /> */}
    </>
  );
};

export default StudentDashboardPage;
