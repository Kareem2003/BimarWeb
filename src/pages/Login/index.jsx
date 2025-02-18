import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctorLogin.jpg";

const LoginScreen = () => {
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
          text="Welcome Back Doctor!"
          descriptionText="Login to Your Account"
        />
        <div className="w-full max-w-md">
          <AppInput
            term={state.doctorEmail}
            onChangeText={(e) => updateProp("doctorEmail", e.target.value)}
            placeholder="Email"
            inputStyle="p-2"
            inputWrapperStyle="mt-10"
          />
          <AppInput
            term={state.doctorPassword}
            onChangeText={(e) => updateProp("doctorPassword", e.target.value)}
            placeholder="Password"
            secureTextEntry={!state.showPassword}
            onIconPress={() => {
              updateProp("showPassword", !state.showPassword);
            }}
            iconName={state.showPassword ? "eye" : "eye-slash"}
            inputStyle="p-2"
            inputWrapperStyle="mt-10 mb-10"
            type={state.showPassword ? "text" : "password"}
          />
          <AppButton
            title="Login"
            onPress={handleLogin}
            buttonStyle="rounded-lg py-2 px-10"
          />
          <div className="mt-10">
            <a
              href="/forget-password"
              className=" text-primary hover:text-tertiary opacity-70"
            >
              Forgot Password?
            </a>
            <p className="mt-4">
              Do not have an account?
              <a href="/register" className="text-textColor">
                <span className="text-center text-base font-bold uppercase italic text-primary hover:text-tertiary">
                  Register
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
