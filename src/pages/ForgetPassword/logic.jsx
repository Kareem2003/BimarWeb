import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";
import { useNavigate } from 'react-router-dom'; // Add this import

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorForgetPassword } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const navigate = useNavigate(); // Add this hook

  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

  const handleForgetPassword = () => {
    // Validate email first
    if (!state.doctorEmail || !/\S+@\S+\.\S+/.test(state.doctorEmail)) {
      ToastManager.notify("Please enter a valid email address.", { type: "error" });
      return;
    }

    doctorForgetPassword(
      {
        doctorEmail: state.doctorEmail,
      },
      (res) => {
        ToastManager.notify(res.data, { type: res.status });
        navigate('/otp'); // Use navigate instead of navigator.navigate
      },
      (err) => {
        console.log("err", err);
        ToastManager.notify(err.response?.data?.message || "Error in sending email", { 
          type: "error" 
        });
      },
      () => {}
    );
  };

  return { state, updateProp, handleForgetPassword };
};

export default Logic;
