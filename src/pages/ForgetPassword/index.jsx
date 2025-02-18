import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctorLogin.jpg";

const ForgetPasswordScreen = () => {
  const { state, updateProp, handleForgetPassword } = Logic();

  return (
    <div className="w-full h-screen flex">
      {/* Left Half - Image */}
      <div className="w-1/2 h-full">
        <img
          src={DoctorLoginImage}
          alt="Doctor Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Half - Form */}
      <div className="w-1/2 h-full bg-gray-100 flex flex-col justify-center items-center p-8 shadow-lg">
        <AuthTitles
          text="Forget Password"
          descriptionText="Enter your email to reset your password"
        />
        <div className="w-full max-w-md">
          <AppInput
            term={state.doctorEmail}
            onChangeText={(e) => updateProp("doctorEmail", e.target.value)}
            placeholder="Email"
            inputStyle="p-2"
            inputWrapperStyle="mt-10"
          />
          <AppButton
            title="Reset Password"
            onPress={handleForgetPassword}
            buttonStyle="rounded-lg py-2 px-10 mt-10"
          />
          <div className="mt-10">
            <p className="mt-4">
              Remembered your password?
              <a href="/login" className="text-textColor">
                <span className="text-center text-base font-bold uppercase italic text-primary hover:text-tertiary">
                  Login
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordScreen;
