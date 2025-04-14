import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";
import { useNavigate } from 'react-router-dom';

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorLogin, verifyOTP } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const navigate = useNavigate();

  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

  const handleLogin = () => {
    doctorLogin(
      {
        doctorEmail: state.doctorEmail,
        doctorPassword: state.doctorPassword,
      },
      (res) => {
        ToastManager.notify(res.data, { type: res.status });
        console.log("res", res);
      },
      (err) => {
        console.log("err", err);
      },
      () => {}
    );
    // Implement login logic here
    console.log("Logging in with", state.doctorEmail, state.doctorPassword);
  };

  const handleVerifyOTP = () => {
    if (!state.otp) {
      ToastManager.notify("Please enter the OTP", { type: "error" });
      return;
    }

    verifyOTP(
      {
        email: state.email,
        otp: state.otp
      },
      (res) => {
        ToastManager.notify("OTP verified successfully!", { type: "success" });
        navigate('/reset-password'); // Navigate to new password page
      },
      (err) => {
        ToastManager.notify(err.response?.data?.message || "Invalid OTP", { 
          type: "error" 
        });
      },
      () => {}
    );
  };

  return { state, updateProp, handleLogin, handleVerifyOTP };
};

export default Logic;
