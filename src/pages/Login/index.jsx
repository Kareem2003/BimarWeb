import React from "react";
import Logic from "./logic";
import AuthTitles from "../../components/AuthTitles";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import DoctorLoginImage from "../../assets/doctor-standing-with-his-arms-crossed-with-copy-space.jpg";

const LoginScreen = () => {
  const { state, updateProp, handleLogin } = Logic();

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
        <div className="w-full h-full bg-white/20 flex flex-col justify-center items-center p-8 shadow-2xl ">
          <AuthTitles
            text="Welcome Back Doctor!"
            descriptionText="Sign in to continue"
          />
          <div className="w-full max-w-md flex flex-col items-center">
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
              buttonStyle="py-2 px-10"
            />
            <div className="mt-5 text-center">
              <a
                href="/forget-password"
                className="text-white hover:text-tertiary"
              >
                Forgot Password?
              </a>
              <p className="mt-16 text-white">
                Do not have an account?
                <a href="/register" className="text-white">
                  <span className="text-center text-base font-bold uppercase italic text-tertiary hover:text-white">
                    Register
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

export default LoginScreen;
