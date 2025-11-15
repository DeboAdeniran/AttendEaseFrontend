import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoleSelectPage from "./pages/RoleSelectPage";
import AccessPage from "./pages/AccessPage";
import LecturerDashboardPage from "./pages/LecturerDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/access" element={<AccessPage />} />
          <Route
            path="/lecturer-dashboard"
            element={<LecturerDashboardPage />}
          />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
