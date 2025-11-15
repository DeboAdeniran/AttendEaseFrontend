/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import { motion } from "motion/react";
import RoleSelectPage from "../../pages/RoleSelectPage";
import Buttons from "../ui/Buttons";
import { Link, useNavigate } from "react-router-dom";

function RoleSelectLayout() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const { AccessRoleButton } = Buttons;
  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access courses, assignments, and learning materials",
      icon: GraduationCap,
    },
    {
      id: "lecturer",
      title: "Lecturer",
      description: "Manage courses, create content, and track progress",
      icon: Users,
    },
  ];

  return (
    // <div className="flex items-center justify-center w-full h-screen lg:p-44 flex-col">
    <div className="w-full max-w-5xl">
      {/* <h1 className="text-3xl pt-16 md:pt-0">SELECT YOUR ROLE</h1> */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-white text-5xl mb-4 tracking-tight">
          Select Your Role
        </h1>
        <p className="text-blue-200 text-lg">
          Choose how you'd like to proceed
        </p>
      </motion.div>
      {/* <div className="flex items-center justify-center flex-col md:flex-row w-full h-full gap-20">
        <Link to="/access?tab=student-signup">
          <AccessRoleButton>STUDENT</AccessRoleButton>
        </Link>
        <Link to="/access?tab=lecturer-signup">
          <AccessRoleButton>LECTURER</AccessRoleButton>
        </Link>
      </div> */}

      <div className="grid md:grid-cols-2 gap-8">
        {roles.map((role, index) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => setSelectedRole(role.id)}
            className="group relative"
          >
            {/* Card */}
            <div
              className={`relative bg-white/5 backdrop-blur-sm border-2 rounded-2xl p-10 transition-all duration-300 ${
                selectedRole === role.id
                  ? "border-blue shadow-2xl shadow-blue-500/30 scale-105"
                  : "border-white/10 hover:border-white/20 hover:scale-102"
              }`}
            >
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue/20 mb-6 border border-blue/30">
                  <role.icon className="w-10 h-10 text-blue" />
                </div>

                {/* Title */}
                <h2 className="text-white text-3xl mb-3">{role.title}</h2>

                {/* Description */}
                <p className="text-blue-200/70">{role.description}</p>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm mr-2">Continue</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Selected indicator */}
              {selectedRole === role.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Continue button */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <button
            className="px-12 py-4 bg-blue hover:bg-blue-500 text-white rounded-xl transition-colors duration-300 shadow-lg shadow-blue-500/30"
            onClick={() => {
              selectedRole === "student"
                ? navigate("/access?tab=student-signup")
                : navigate("/access?tab=lecturer-signup");
            }}
          >
            Continue as {selectedRole === "student" ? "Student" : "Lecturer"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default RoleSelectLayout;
