import React from "react";
import DashboardNavbar from "../ui/DashboardNavbar";
// import LecturerOverviewCards from "../ui/LecturerOverviewCards";
import LecturerOverviewCards from "../ui/LecturerOverviewCards";
import { useSearchParams } from "react-router-dom";

const DashboardOverview = () => {
  const { RealTimeDisplay, OverViewDetailsCard, DashboardAttendanceOverview } =
    LecturerOverviewCards;

  return (
    <div className="flex flex-col gap-15 p-4 md:p-0">
      <div className="flex flex-col gap-4 w-full">
        <div>
          <div>
            <p className="text-text-grey text-xs">Dashboard</p>
          </div>
        </div>
        <div className="flex flex-col  md:flex-row gap-10 md:gap-20 w-full  justify-between">
          <RealTimeDisplay />
          <div className="flex flex-wrap items-center justify-between gap-10 w-full">
            <OverViewDetailsCard />
          </div>
        </div>
      </div>
      <DashboardAttendanceOverview />
    </div>
  );
};

const AttendanceView = () => {
  const { AttendanceTable } = LecturerOverviewCards;
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <p className="text-text-grey text-xs">Attendance</p>
      </div>
      {/* Your attendance table component here */}
      <div className="w-full">
        <AttendanceTable />
      </div>
    </div>
  );
};

const CourseView = () => {
  const { CourseManagement } = LecturerOverviewCards;
  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Courses</p>
      </div>
      <div className="w-full">
        <CourseManagement />
      </div>
    </div>
  );
};

const ClassView = () => {
  const { ClassTimeTable, ClassCard } = LecturerOverviewCards;
  return (
    <div className="flex flex-col gap-4 w-full ">
      <div>
        <p className="text-text-grey text-xs">Classes</p>
      </div>
      <div className="w-full flex flex-col gap-6">
        <ClassCard />
        <ClassTimeTable />
      </div>
    </div>
  );
};

const StudentsView = () => {
  const { StudentManagement } = LecturerOverviewCards;
  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Students</p>
      </div>
      <div className="w-full">
        <StudentManagement />
      </div>
    </div>
  );
};

const LecturerDashboardLayout = ({ onMenuToggle }) => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <DashboardOverview />;
      case "attendance":
        return <AttendanceView />;
      case "course":
        return <CourseView />;
      case "class":
        return <ClassView />;
      case "students":
        return <StudentsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <DashboardNavbar onMenuToggle={onMenuToggle} />
      {renderContent()}
    </div>
  );
};

export default LecturerDashboardLayout;
