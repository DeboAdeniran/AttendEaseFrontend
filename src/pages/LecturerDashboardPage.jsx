import React, { useState } from "react";
import DashboardSidebar from "../components/ui/DashboardSidebar";
import LecturerDashboardLayout from "../components/layout/LecturerDashboardLayout";

const LecturerDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className=" h-screen md:flex md:gap-8 lg:gap-8 ">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <LecturerDashboardLayout
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </>
  );
};

export default LecturerDashboardPage;
