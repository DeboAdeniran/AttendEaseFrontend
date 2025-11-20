import React from "react";
import { useAuth } from "../../context/AuthContext";

const AuthDebugComponent = () => {
  const auth = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-blue text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="text-lg font-bold mb-2 text-blue">Auth Debug Info</h3>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-400">Authenticated:</span>{" "}
          <span className="text-green-400">
            {auth.isAuthenticated ? "✓ Yes" : "✗ No"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Role:</span>{" "}
          <span className="text-blue">{auth.userRole || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-400">User ID:</span>{" "}
          <span className="text-yellow-400">{auth.userId || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-400">Lecturer ID:</span>{" "}
          <span className="text-purple-400">{auth.lecturerId || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-400">Student ID:</span>{" "}
          <span className="text-pink-400">{auth.studentId || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-400">Email:</span>{" "}
          <span className="text-cyan-400">{auth.userEmail || "N/A"}</span>
        </div>
        <div>
          <span className="text-gray-400">Name:</span>{" "}
          <span className="text-orange-400">{auth.userName || "N/A"}</span>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <span className="text-gray-400">Profile Object:</span>
          <pre className="mt-1 p-2 bg-black rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(auth.profile, null, 2)}
          </pre>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <span className="text-gray-400">Full User Object:</span>
          <pre className="mt-1 p-2 bg-black rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(auth.user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugComponent;
