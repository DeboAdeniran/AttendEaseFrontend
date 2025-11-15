import { useSearchParams } from "react-router-dom";
import DashboardNavbar from "../ui/DashboardNavbar";
import StudentOverviewCards from "../ui/StudentOverviewCard";
import {
  Bell,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

const DashboardOverview = () => {
  const {
    StudentWelcomeCard,
    OverallAttendanceCard,
    QuickStatsCards,
    NotificationsPanel,
    ClassAttendanceBreakdown,
    TodaysClassesCard,
  } = StudentOverviewCards;
  const studentStats = {
    totalClasses: 5,
    presentDays: 82,
    absentDays: 13,
    atRiskClasses: 2,
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      {/* Welcome Section */}
      <StudentWelcomeCard studentName="Adebayo Johnson" />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverallAttendanceCard percentage={87} />
        <QuickStatsCards stats={studentStats} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <TodaysClassesCard />
          <ClassAttendanceBreakdown />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

const ClassView = () => {
  const { StudentClassesView } = StudentOverviewCards;
  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Classes</p>
      </div>
      <StudentClassesView />
    </div>
  );
};

const AttendanceView = () => {
  const { StudentAttendanceRecord } = StudentOverviewCards;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Attendance Record</p>
      </div>
      <StudentAttendanceRecord />
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
      // Add other cases as needed
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
