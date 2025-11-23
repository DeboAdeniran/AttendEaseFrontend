/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardNavbar from "../ui/DashboardNavbar";
import StudentOverviewCards from "../ui/StudentOverviewCard";
import { FullPageLoader } from "../common/LoadingSpinner";
import { FullPageError } from "../common/ErrorMessage";
import {
  useStudentDashboard,
  useStudentClasses,
  useStudentAttendance,
  useEnrollClass,
} from "../../hooks";
import { useAuth } from "../../context/AuthContext";
import QRScannerModal from "../ui/QRScannerModal";
import { QrCode } from "lucide-react";

const DashboardOverview = () => {
  const { user } = useAuth();
  const {
    StudentWelcomeCard,
    OverallAttendanceCard,
    QuickStatsCards,
    NotificationsPanel,
    ClassAttendanceBreakdown,
    TodaysClassesCard,
  } = StudentOverviewCards;

  const [showQRScanner, setShowQRScanner] = useState(false);
  // Fetch dashboard statistics
  const { dashboardData, loading, error } = useStudentDashboard();

  // Extract student name from user profile
  const studentName = user?.profile
    ? `${user.profile.first_name} ${user.profile.last_name}`
    : "Student";
  console.log("User Profile:", user?.profile);
  console.log("Dashboard Data:", dashboardData);

  if (loading) return <FullPageLoader text="Loading dashboard..." />;
  if (error) return <FullPageError message={error} />;

  // Transform backend data to match component expectations
  const stats = {
    totalClasses: dashboardData?.data?.total_classes || 0,
    presentDays: dashboardData?.data?.present_days || 0,
    absentDays: dashboardData?.data?.absent_days || 0,
    atRiskClasses: dashboardData?.data?.at_risk_classes || 0,
  };

  const overallPercentage = Math.round(
    dashboardData?.data?.overall_attendance_percentage || 0
  );

  // Extract data from backend response
  const todaysClasses = dashboardData?.data?.todays_classes || [];
  const classBreakdown = dashboardData?.data?.class_breakdown || [];
  const notifications = dashboardData?.data?.notifications || [];

  console.log("Dashboard Data:", dashboardData);
  console.log("Transformed Stats:", stats);
  console.log("Today's Classes:", todaysClasses);
  console.log("Class Breakdown:", classBreakdown);
  console.log("Notifications:", notifications);
  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      <StudentWelcomeCard studentName={studentName} />
      <button
        onClick={() => setShowQRScanner(true)}
        className="bg-blue hover:bg-blue/80 text-white py-2 px-4 rounded-md text-sm flex items-center gap-2"
      >
        <QrCode size={18} />
        Scan QR
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverallAttendanceCard percentage={overallPercentage} />
        <QuickStatsCards stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodaysClassesCard classes={todaysClasses} />
          <ClassAttendanceBreakdown classData={classBreakdown} />
        </div>

        <div className="lg:col-span-1">
          <NotificationsPanel notifications={notifications} />
        </div>
      </div>
      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onSuccess={(attendance) => {
            console.log("Attendance marked:", attendance);
            // Refresh dashboard data if needed
          }}
        />
      )}
    </div>
  );
};

const ClassView = () => {
  const { user } = useAuth();
  const { StudentClassesView } = StudentOverviewCards;
  const studentId = user?.profile?.id;

  const { classes, loading, error, refetch } = useStudentClasses(studentId);

  if (loading) return <FullPageLoader text="Loading classes..." />;
  if (error) return <FullPageError message={error} />;

  // Transform the classes data to match StudentClassesView expectations
  const transformedClasses = (classes?.data || classes || []).map((cls) => ({
    id: cls.id,
    classCode: cls.class_code,
    courseCode: cls.course_code,
    courseName: cls.course_name,
    lecturerName: cls.lecturer_name,
    schedule: [
      {
        day: cls.day_of_week,
        time: `${cls.start_time?.substring(0, 5)} - ${cls.end_time?.substring(
          0,
          5
        )}`,
        location: cls.location,
      },
    ],
    attendance: Math.round(
      ((cls.present_count || 0) / (cls.total_sessions || 1)) * 100
    ),
    presentDays: cls.present_count || 0,
    totalDays: cls.total_sessions || 0,
    semester: cls.semester || "N/A",
    credits: cls.credits || 0,
    status:
      ((cls.present_count || 0) / (cls.total_sessions || 1)) * 100 < 85
        ? "at-risk"
        : "active",
  }));

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">My Classes</p>
      </div>
      <StudentClassesView
        enrolledClasses={transformedClasses}
        onRefresh={refetch}
      />
    </div>
  );
};
const AttendanceView = () => {
  const { user } = useAuth();
  const { StudentAttendanceRecord } = StudentOverviewCards;
  const studentId = user?.profile?.id;

  // Fetch attendance records with filters
  const { attendance, loading, error, refetch } = useStudentAttendance({
    student_id: studentId,
  });

  if (loading) return <FullPageLoader text="Loading attendance records..." />;
  if (error) return <FullPageError message={error} />;

  // Pass the attendance records directly to the component
  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Attendance Record</p>
      </div>
      <StudentAttendanceRecord
        attendanceRecords={attendance}
        onRefresh={refetch}
      />
    </div>
  );
};

const AnalyticsView = () => {
  const { StudentAnalytics } = StudentOverviewCards;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Analytics & Trends</p>
      </div>
      {/* StudentAnalytics now fetches its own data */}
      <StudentAnalytics />
    </div>
  );
};

const ProfileView = () => {
  const { StudentProfile } = StudentOverviewCards;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Profile & Settings</p>
      </div>
      <StudentProfile />
    </div>
  );
};

const StudentDashboardLayout = ({ onMenuToggle }) => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <DashboardOverview />;
      case "class":
        return <ClassView />;
      case "attendance":
        return <AttendanceView />;
      case "analytics":
        return <AnalyticsView />;
      case "profile":
        return <ProfileView />;
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

export default StudentDashboardLayout;
