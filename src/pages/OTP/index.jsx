import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctorLogin.jpg";

const OTPScreen = () => {
  const { state, updateProp, handleLogin } = Logic();

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
          text="Enter OTP"
          descriptionText="Enter the OTP sent to your email to reset your password"
        />
        <div className="w-full max-w-md">
          <AppInput
            term={state.otp}
            onChangeText={(e) => updateProp("otp", e.target.value)}
            placeholder="OTP"
            inputStyle="p-2"
            inputWrapperStyle="mt-10"
          />
          <AppButton
            title="Verify OTP"
            onPress={handleLogin}
            buttonStyle="rounded-lg py-2 px-10 mt-10"
          />
          <div className="mt-10">
            <p className="mt-4">
              Did not receive OTP?
              <a href="/resend-otp" className="text-textColor">
                <span className="text-center text-base font-bold uppercase italic text-primary hover:text-tertiary">
                  Resend OTP
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPScreen;
