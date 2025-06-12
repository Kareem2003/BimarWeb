import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctor-standing-with-his-arms-crossed-with-copy-space.jpg";

const ForgetPasswordScreen = () => {
  const { state, updateProp, handleForgetPassword } = Logic();

  return (
    <div className="w-full h-screen relative">
      {/* Background Image */}
      <div className="w-full h-full absolute inset-0">
        <img
          src={DoctorLoginImage}
          alt="Doctor Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Container */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 w-[40%] h-[80%] flex items-center justify-center">
        <div className="w-full h-full bg-white/20 flex flex-col justify-center items-center p-8 shadow-2xl">
          <AuthTitles
            text="Forget Password"
            descriptionText="Enter your email to reset your password"
            titleClass="text-4xl font-bold text-primary mb-4"
            descClass="text-white/80"
          />
          <div className="w-full max-w-md flex flex-col items-center">
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
              buttonStyle="py-2 px-10 mt-10"
            />
            <div className="mt-5 text-center">
              <p className="mt-16 text-white">
                Remembered your password?{" "}
                <a href="/login" className="text-white">
                  <span className="text-center text-base font-bold uppercase italic text-test hover:text-white">
                    Login
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordScreen;
