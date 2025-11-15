import React, { useState } from "react";
import DashboardSidebar from "../components/ui/DashboardSidebar";
import StudentDashboardLayout from "../components/layout/StudentDashboardLayout";

const StudentDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="hidden h-screen md:flex md:gap-8 lg:gap-8 ">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <StudentDashboardLayout
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </>
  );
};

export default StudentDashboardPage;
