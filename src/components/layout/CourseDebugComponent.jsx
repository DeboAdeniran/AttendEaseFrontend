// Create this file: src/components/layout/CourseDebugComponent.jsx
import React from "react";
import { useLecturerCourses } from "../../hooks/course";
import { useAuth } from "../../context/AuthContext";

const CourseDebugComponent = () => {
  const auth = useAuth();
  const { courses, loading, error } = useLecturerCourses();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black border-2 border-yellow-400 p-4 rounded-lg max-w-md max-h-96 overflow-y-auto text-xs font-mono">
      <h3 className="text-yellow-400 font-bold mb-2">🐛 COURSE DEBUG</h3>

      <div className="text-white mb-2">
        <p>
          👤 User ID: <span className="text-green-400">{auth.userId}</span>
        </p>
        <p>
          📍 Lecturer ID:{" "}
          <span className="text-green-400">{auth.lecturerId}</span>
        </p>
        <p>
          ⚙️ Loading:{" "}
          <span className={loading ? "text-yellow-400" : "text-green-400"}>
            {String(loading)}
          </span>
        </p>
        <p>
          ❌ Error:{" "}
          <span className={error ? "text-red-400" : "text-green-400"}>
            {error || "None"}
          </span>
        </p>
      </div>

      <div className="text-white border-t border-yellow-400 pt-2 mt-2">
        <p className="text-yellow-400 font-bold">📚 Courses Data:</p>
        <p className="text-blue-400">Type: {typeof courses}</p>
        <p className="text-blue-400">
          Is Array: {Array.isArray(courses) ? "✅ YES" : "❌ NO"}
        </p>
        <p className="text-blue-400">
          Length: {Array.isArray(courses) ? courses.length : "N/A"}
        </p>
      </div>

      {Array.isArray(courses) && courses.length > 0 && (
        <div className="text-white border-t border-yellow-400 pt-2 mt-2">
          <p className="text-yellow-400 font-bold">📋 First Course:</p>
          <pre className="text-green-400 text-xs whitespace-pre-wrap break-words">
            {JSON.stringify(courses[0], null, 2).substring(0, 300)}...
          </pre>
        </div>
      )}

      {Array.isArray(courses) && courses.length === 0 && (
        <div className="text-white border-t border-yellow-400 pt-2 mt-2">
          <p className="text-red-400">⚠️ No courses found (empty array)</p>
        </div>
      )}
    </div>
  );
};

export default CourseDebugComponent;
