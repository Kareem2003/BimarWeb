import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";
import { useNavigate } from 'react-router-dom';
import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorResetPassword } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const navigate = useNavigate();

  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

  const handleResetPassword = () => {
    if (!state.newPassword || !state.confirmPassword) {
      ToastManager.notify("Please fill in all fields", { type: "error" });
      return;
    }

    if (state.newPassword !== state.confirmPassword) {
      ToastManager.notify("Passwords do not match", { type: "error" });
      return;
    }

    if (state.newPassword.length < 8) {
      ToastManager.notify("Password must be at least 8 characters long", { type: "error" });
      return;
    }

    doctorResetPassword(
      {
        email: state.email,
        newPassword: state.newPassword,
      },
      (res) => {
        ToastManager.notify("Password reset successfully!", { type: "success" });
        navigate('/login');
      },
      (err) => {
        ToastManager.notify(err.response?.data?.message || "Error resetting password", { 
          type: "error" 
        });
      },
      () => {}
    );
  };

  return { state, updateProp, handleResetPassword };
};

export default Logic;