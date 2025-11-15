/* eslint-disable no-unused-vars */
import React from "react";
import { CustomInput } from "../ui/CustomInput";
import Buttons from "../ui/Buttons";
import { motion } from "motion/react";

const Login = ({ signupRedirect, LoginSignupRedirect }) => {
  const { SubmitButton } = Buttons;
  // const [searchParams] = useSearchParams();
  // const tab = searchParams.get("tab") || "access";

  return (
    <>
      <div className="text-center mb-8">
        <h1 className=" text-white text-3xl mb-3">Log in</h1>
        <p className="text-text-grey text-sm">Log in to your account</p>
      </div>

      <form action="" className="space-y-5 ">
        <div className="flex flex-col  gap-4 w-full items-center justify-center">
          <CustomInput
            placeholder={"Email"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"email"}
            required
          />
          <CustomInput
            placeholder={"Password"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"password"}
            required
          />
        </div>
        <div className="flex flex-col gap-3 w-full text-center">
          <SubmitButton
            name="Log in"
            LoginSignupRedirect={LoginSignupRedirect}
          />
          <p className="text-xs text-text-grey flex gap-2 w-full items-center justify-center">
            Didn't have an account?{" "}
            <span className="text-blue" onClick={signupRedirect}>
              Sign up
            </span>
          </p>
        </div>
      </form>
    </>
  );
};
const StudentSignUp = ({ signupRedirect, LoginSignupRedirect }) => {
  const { SubmitButton } = Buttons;
  return (
    <>
      <div className="text-center mb-8">
        <h1 className=" text-white text-3xl mb-3 ">Create an account</h1>
        <p className="text-text-grey text-sm">
          Create your student account to join your classes, mark your
          attendance, and stay updated with your course activities
        </p>
      </div>

      <form action="" className="space-y-5">
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder={"First Name"}
              className=""
              variant={"blurry"}
              // onChange={handleChange}
              name={"firstname"}
              required
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder={"Last Name"}
              className=""
              variant={"blurry"}
              // onChange={handleChange}
              name={"lastname"}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder={"Email"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"email"}
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder={"Level"}
              className=""
              variant={"blurry"}
              // onChange={handleChange}
              name={"level"}
              required
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder={"Department"}
              className=""
              variant={"blurry"}
              // onChange={handleChange}
              name={"department"}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder={"Password"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"password"}
            required
          />
        </div>
        <div className="flex flex-col gap-3 w-full text-center">
          <SubmitButton name="Create account" onClick={LoginSignupRedirect} />
          <p className="text-xs text-text-grey flex gap-2 w-full items-center justify-center  ">
            Already have an account?{" "}
            <span className="text-blue" onClick={signupRedirect}>
              Login
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

const LecturerSignUp = ({ signupRedirect, LoginSignupRedirect }) => {
  const { SubmitButton } = Buttons;
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-white text-3xl mb-3 ">Create an account</h1>
        <p className="text-text-grey text-sm">
          Create your lecturer account set up your courses, take attendance, and
          monitor student participation efficiently
        </p>
      </div>

      <form action="" className="space-y-5">
        <div className="flex flex-col md:flex-row gap-5 md:gap-4">
          <div className="w-full">
            <CustomInput
              placeholder={"First Name"}
              className=""
              variant={"blurry"}
              // onChange={handleChange}
              name={"firstname"}
              required
            />
          </div>
          <div className="w-full">
            <CustomInput
              placeholder={"Last Name"}
              className=""
              variant={"blurry"}
              // onChange={handleChange}
              name={"lastname"}
              required
            />
          </div>
        </div>
        <div className="w-full">
          <CustomInput
            placeholder={"Email"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"email"}
            required
          />
        </div>

        <div className="w-full">
          <CustomInput
            placeholder={"Department"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"department"}
            required
          />
        </div>
        <div className="w-full">
          <CustomInput
            placeholder={"Password"}
            className=""
            variant={"blurry"}
            // onChange={handleChange}
            name={"password"}
            required
          />
        </div>
        <div className="flex flex-col gap-3 w-full text-center">
          <SubmitButton name="Create account" onClick={LoginSignupRedirect} />
          <p className="text-xs text-text-grey flex gap-2 w-full items-center justify-center ">
            Already have an account?
            <span className="text-blue" onClick={signupRedirect}>
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
