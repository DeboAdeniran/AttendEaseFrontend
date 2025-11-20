/* eslint-disable no-unused-vars */
import React from "react";
import DashboardNavbar from "../ui/DashboardNavbar";
import LecturerOverviewCards from "../ui/LecturerOverviewCards";
import { useSearchParams } from "react-router-dom";
import {
  useLecturerDashboard,
  useLecturerClasses,
  useAllStudents,
} from "../../hooks";
import { FullPageLoader } from "../common/LoadingSpinner";
import { FullPageError } from "../common/ErrorMessage";
import { useLecturerCourses } from "../../hooks/course";
import { useCourseManagement } from "../../hooks/course";
import { DashboardProvider } from "../../context/DashboardContext";

const DashboardOverview = () => {
  const { RealTimeDisplay, OverViewDetailsCard, DashboardAttendanceOverview } =
    LecturerOverviewCards;

  const { dashboardData, loading, error } = useLecturerDashboard();

  if (loading) return <FullPageLoader text="Loading dashboard..." />;
  if (error) return <FullPageError message={error} />;

  return (
    <div className="flex flex-col gap-15 p-4 md:p-0">
      <div className="flex flex-col gap-4 w-full">
        <div>
          <p className="text-text-grey text-xs">Dashboard</p>
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-between">
          <RealTimeDisplay />
          <div className="flex flex-wrap items-center justify-between gap-10 w-full">
            <OverViewDetailsCard stats={dashboardData} />
          </div>
        </div>
      </div>
      <DashboardAttendanceOverview stats={dashboardData} />
    </div>
  );
};

// const AttendanceView = () => {
//   const { AttendanceTable } = LecturerOverviewCards;
//   const { classes, loading, error } = useLecturerClasses();

//   if (loading) return <FullPageLoader text="Loading classes..." />;
//   if (error) return <FullPageError message={error} />;

//   return (
//     <div className="flex flex-col gap-4 w-full">
//       <div>
//         <p className="text-text-grey text-xs">Attendance</p>
//       </div>
//       <div className="w-full">
//         <AttendanceTable classes={classes} />
//       </div>
//     </div>
//   );
// };

const AttendanceView = () => {
  const { AttendanceTable } = LecturerOverviewCards;
  const { classes, loading, error } = useLecturerClasses();

  console.log("📊 AttendanceView - Classes:", {
    classesLength: classes?.length,
    classesData: classes,
    loading,
    error,
  });

  if (loading) return <FullPageLoader text="Loading classes..." />;
  if (error) return <FullPageError message={error} />;

  // Extract the actual array from the response
  const classesArray = classes?.data || classes || [];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <p className="text-text-grey text-xs">Attendance Management</p>
      </div>
      <div className="w-full">
        <AttendanceTable classes={classesArray} />
      </div>
    </div>
  );
};

const CourseView = () => {
  const { CourseManagement } = LecturerOverviewCards;
  const { courses, loading, error, refetch } = useLecturerCourses();

  console.log("🎓 CourseView Render:", {
    coursesLength: courses?.length,
    loading,
    error,
    coursesType: typeof courses,
    isArray: Array.isArray(courses),
  });

  const { createCourse, updateCourse, archiveCourse, unarchiveCourse } =
    useCourseManagement();

  const handleCreateCourse = async (courseData) => {
    console.log("➕ Creating course:", courseData);
    const result = await createCourse(courseData);
    if (result.success) {
      console.log("✅ Course created, refetching...");
      refetch();
    }
    return result;
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    console.log("✏️ Updating course:", courseId, courseData);
    const result = await updateCourse(courseId, courseData);
    if (result.success) {
      console.log("✅ Course updated, refetching...");
      refetch();
    }
    return result;
  };

  const handleArchiveCourse = async (courseId) => {
    console.log("📦 Archiving course:", courseId);
    const result = await archiveCourse(courseId);
    if (result.success) {
      console.log("✅ Course archived, refetching...");
      refetch();
    }
    return result;
  };

  const handleUnarchiveCourse = async (courseId) => {
    console.log("📂 Unarchiving course:", courseId);
    const result = await unarchiveCourse(courseId);
    if (result.success) {
      console.log("✅ Course unarchived, refetching...");
      refetch();
    }
    return result;
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">My Courses</p>
      </div>
      <div className="w-full">
        <CourseManagement
          courses={courses.data}
          loading={loading}
          error={error}
          onCreateCourse={handleCreateCourse}
          onUpdateCourse={handleUpdateCourse}
          onArchiveCourse={handleArchiveCourse}
          onUnarchiveCourse={handleUnarchiveCourse}
        />
      </div>
    </div>
  );
};

const ClassView = () => {
  const { ClassTimeTable, ClassCard } = LecturerOverviewCards;
  const { classes, loading, error, refetch } = useLecturerClasses();

  if (loading) return <FullPageLoader text="Loading classes..." />;
  if (error) return <FullPageError message={error} />;

  return (
    <div className="flex flex-col gap-4 w-full px-4">
      <div>
        <p className="text-text-grey text-xs">Classes</p>
      </div>
      <div className="w-full flex flex-col gap-6">
        <ClassCard classes={classes?.data || classes || []} />
        <ClassTimeTable
          classes={classes?.data || classes || []}
          onClassCreated={refetch}
        />
      </div>
    </div>
  );
};

const StudentsView = () => {
  const { StudentManagement } = LecturerOverviewCards;
  const { students, loading, error, searchStudents } = useAllStudents();

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Students</p>
      </div>
      <div className="w-full">
        <StudentManagement
          students={students}
          loading={loading}
          error={error}
          onSearch={searchStudents}
        />
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { LecturerProfile } = LecturerOverviewCards;
  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">
      <div>
        <p className="text-text-grey text-xs">Profile & Settings</p>
      </div>
      <LecturerProfile />
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
      case "profile":
        return <ProfileView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardProvider>
      <div className="w-full flex flex-col gap-8">
        <DashboardNavbar onMenuToggle={onMenuToggle} />
        {renderContent()}
      </div>
    </DashboardProvider>
  );
};

export default LecturerDashboardLayout;
