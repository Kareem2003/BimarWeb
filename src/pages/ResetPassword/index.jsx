import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctor-standing-with-his-arms-crossed-with-copy-space.jpg";

const ResetPasswordScreen = () => {
  const { state, updateProp, handleResetPassword } = Logic();

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
            text="Reset Password"
            descriptionText="Enter your new password"
            titleClass="text-4xl font-bold text-primary mb-4"
            descClass="text-white/80"
          />
          <div className="w-full max-w-md flex flex-col items-center">
            <AppInput
              term={state.newPassword}
              onChangeText={(e) => updateProp("newPassword", e.target.value)}
              placeholder="New Password"
              secureTextEntry={!state.showPassword}
              onIconPress={() => updateProp("showPassword", !state.showPassword)}
              iconName={state.showPassword ? "eye" : "eye-slash"}
              inputStyle="p-2"
              inputWrapperStyle="mt-10"
              type={state.showPassword ? "text" : "password"}
            />
            <AppInput
              term={state.confirmPassword}
              onChangeText={(e) => updateProp("confirmPassword", e.target.value)}
              placeholder="Confirm Password"
              secureTextEntry={!state.showConfirmPassword}
              onIconPress={() => updateProp("showConfirmPassword", !state.showConfirmPassword)}
              iconName={state.showConfirmPassword ? "eye" : "eye-slash"}
              inputStyle="p-2"
              inputWrapperStyle="mt-10"
              type={state.showConfirmPassword ? "text" : "password"}
            />
            <AppButton
              title="Reset Password"
              onPress={handleResetPassword}
              buttonStyle="py-2 px-10 mt-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;