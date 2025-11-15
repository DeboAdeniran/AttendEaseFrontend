/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import React from "react";
import bg from "../assets/logo.svg";
import AccessLayout from "../components/layout/AccessLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AccessPage = () => {
  const { Login, StudentSignUp, LecturerSignUp } = AccessLayout;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "access";
  const navigate = useNavigate();
  const signupRedirect = () => {
    if (tab == "lecturer-signup") {
      navigate("/access?tab=lecturer-signin");
    } else if (tab == "student-signup") {
      navigate("/access?tab=student-signin");
    } else if (tab == "lecturer-signin") {
      navigate("/access?tab=lecturer-signup");
    } else if (tab == "student-signin") {
      navigate("/access?tab=student-signup");
    }
  };
  const LoginSignupRedirect = () => {
    if (tab == "lecturer-signup") {
      navigate("/lecturer-dashboard?tab=overview");
    } else if (tab == "student-signup") {
      navigate("/student-dashboard?tab=overview");
    } else if (tab == "lecturer-signin") {
      navigate("/lecturer-dashboard?tab=overview");
    } else if (tab == "student-signin") {
      navigate("/student-dashboard?tab=overview");
    }
  };
  const onBack = () => {
    navigate("/");
  };
  return (
    <div
      className="min-h-screen bg-primary flex items-center justify-center p-6"
      style={{ background: "linear-gradient(to bottom, #101e39, #080808)" }}
    >
      <motion.div
        key="signup-form"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-xl"
      >
        <button
          onClick={onBack}
          className="mb-8 flex items-center transition-colors"
          style={{ color: "#3354f4" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1348fc")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#3354f4")}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to role selection
        </button>
        <div
          className="backdrop-blur-sm border-2 rounded-3xl py-6 px-4 md:p-8 shadow-2xl bg-glass-black border-blue "
          style={{
            boxShadow: "0 0 40px rgba(51, 84, 244, 0.2)",
          }}
        >
          {/* <div className="flex w-full flex-row items-start  justify-between "> */}
          {tab == "lecturer-signup" ? (
            <LecturerSignUp
              LoginSignupRedirect={LoginSignupRedirect}
              signupRedirect={signupRedirect}
            />
          ) : tab == "student-signup" ? (
            <StudentSignUp
              LoginSignupRedirect={LoginSignupRedirect}
              signupRedirect={signupRedirect}
            />
          ) : (
            <Login
              LoginSignupRedirect={LoginSignupRedirect}
              signupRedirect={signupRedirect}
            />
          )}
        </div>
        {/* </div> */}
      </motion.div>
    </div>
  );
};

export default AccessPage;
