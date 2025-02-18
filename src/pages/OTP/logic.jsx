import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorLogin } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";
const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
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

  return { state, updateProp, handleLogin };
};

export default Logic;
