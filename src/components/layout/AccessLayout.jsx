// src/components/layout/AccessLayout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../ui/CustomInput";
import Buttons from "../ui/Buttons";
import { useAuth } from "../../context/AuthContext";

const Login = ({ signupRedirect }) => {
  const { SubmitButton } = Buttons;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on user role
      const redirectPath =
        result.user.role === "lecturer"
          ? "/lecturer-dashboard?tab=overview"
          : "/student-dashboard?tab=overview";
      navigate(redirectPath);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl mb-3">Log in</h1>
        <p className="text-text-grey text-sm">Log in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <CustomInput
            placeholder="Email"
            onChange={handleChange}
            name="email"
            type="email"
            value={formData.email}
            required
          />
          <CustomInput
            placeholder="Password"
            onChange={handleChange}
            name="password"
            type="password"
            value={formData.password}
            required
          />
        </div>
        <div className="flex flex-col gap-3 w-full text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue hover:opacity-90 text-white py-3 rounded-md text-sm transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p className="text-xs text-text-grey flex gap-2 w-full items-center justify-center">
            Didn't have an account?{" "}
            <span className="text-blue cursor-pointer" onClick={signupRedirect}>
              Sign up
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

const StudentSignUp = ({ signupRedirect }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    matric_no: "",
    department: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register({
      ...formData,
      role: "student",
    });

    if (result.success) {
      navigate("/student-dashboard?tab=overview");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl mb-3">Create an account</h1>
        <p className="text-text-grey text-sm">
          Create your student account to join your classes, mark your
          attendance, and stay updated with your course activities
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder="First Name"
              onChange={handleChange}
              name="first_name"
              value={formData.first_name}
              required
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder="Last Name"
              onChange={handleChange}
              name="last_name"
              value={formData.last_name}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder="Email"
            type="email"
            onChange={handleChange}
            name="email"
            value={formData.email}
            required
          />
        </div>
        <div className="w-full">
          <CustomInput
            placeholder="Matric Number (e.g., 22/3001)"
            onChange={handleChange}
            name="matric_no"
            value={formData.matric_no}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder="Level (e.g., 400)"
              onChange={handleChange}
              name="level"
              value={formData.level}
              required
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder="Department"
              onChange={handleChange}
              name="department"
              value={formData.department}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder="Password"
            type="password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            required
          />
        </div>
        <div className="flex flex-col gap-3 w-full text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue hover:opacity-90 text-white py-3 rounded-md text-sm transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p className="text-xs text-text-grey flex gap-2 w-full items-center justify-center">
            Already have an account?{" "}
            <span className="text-blue cursor-pointer" onClick={signupRedirect}>
              Login
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

const LecturerSignUp = ({ signupRedirect }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    staff_id: "",
    department: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await register({
      ...formData,
      role: "lecturer",
    });

    if (result.success) {
      navigate("/lecturer-dashboard?tab=overview");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl mb-3">Create an account</h1>
        <p className="text-text-grey text-sm">
          Create your lecturer account set up your courses, take attendance, and
          monitor student participation efficiently
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder="First Name"
              onChange={handleChange}
              name="first_name"
              value={formData.first_name}
              required
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder="Last Name"
              onChange={handleChange}
              name="last_name"
              value={formData.last_name}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder="Email"
            type="email"
            onChange={handleChange}
            name="email"
            value={formData.email}
            required
          />
        </div>
        <div className="w-full">
          <CustomInput
            placeholder="Staff ID (e.g., LEC001)"
            onChange={handleChange}
            name="staff_id"
            value={formData.staff_id}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder="Title (e.g., Dr., Prof.)"
              onChange={handleChange}
              name="title"
              value={formData.title}
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder="Department"
              onChange={handleChange}
              name="department"
              value={formData.department}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder="Password"
            type="password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            required
          />
        </div>
        <div className="flex flex-col gap-3 w-full text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue hover:opacity-90 text-white py-3 rounded-md text-sm transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p className="text-xs text-text-grey flex gap-2 w-full items-center justify-center">
            Already have an account?
            <span className="text-blue cursor-pointer" onClick={signupRedirect}>
              Login
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

const AccessLayout = {
  Login,
  StudentSignUp,
  LecturerSignUp,
};

export default AccessLayout;
