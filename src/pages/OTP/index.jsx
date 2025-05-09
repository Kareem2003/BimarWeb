import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctor-standing-with-his-arms-crossed-with-copy-space.jpg";

const OTPScreen = () => {
  const { state, updateProp, handleVerifyOTP } = Logic();

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
            text="Enter OTP"
            descriptionText="Enter the OTP sent to your email"
            titleClass="text-4xl font-bold text-primary mb-4"
            descClass="text-white/80"
          />
          <div className="w-full max-w-md flex flex-col items-center">
            <AppInput
              term={state.otp}
              onChangeText={(e) => updateProp("otp", e.target.value)}
              placeholder="Enter OTP"
              type="text"
              inputStyle="p-2"
              inputWrapperStyle="mt-10"
            />
            <AppButton
              title="Verify OTP"
              onPress={handleVerifyOTP}
              buttonStyle="py-2 px-10 mt-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPScreen;
