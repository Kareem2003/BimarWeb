import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorForgetPassword } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";
const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

  const handleForgetPassword = () => {
    doctorForgetPassword(
      {
        doctorEmail: state.doctorEmail,
      },
      (res) => {
        console.log(res);
        ToastManager.notify(res.data, { type: res.status });
        navigator.navigate("/otp");
      },
      (err) => {
        console.log("err", err);
        ToastManager.notify("Error in sending email", { type: "error" });
      },
      () => {}
    );
    // Implement login logic here
    console.log("Logging in with", state.doctorEmail);
  };

  return { state, updateProp, handleForgetPassword };
};

export default Logic;
