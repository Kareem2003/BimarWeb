import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";
import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorLogin } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  AUTHENTICATION_TOKEN,
  DOCTOR_INFO,
} from "../../helpers/constants/StaticKeys";

const Logic = () => {
  const navigate = useNavigate(); // Use the useNavigate hook
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

  const validateInputs = () => {
    if (!state.doctorEmail || !state.doctorPassword) {
      ToastManager.notify("Please fill in all fields.", { type: "error" });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(state.doctorEmail)) {
      ToastManager.notify("Please enter a valid email address.", {
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateInputs()) return;

    doctorLogin(
      {
        doctorEmail: state.doctorEmail,
        doctorPassword: state.doctorPassword,
      },
      (res) => {
        console.log("Login response:", res);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="));

        if (token) {
          const authToken = token.split("=")[1];
          localStorage.setItem(AUTHENTICATION_TOKEN, authToken);

          // Check if user is admin
          // In your login handler
          if (res.user && res.user.isAdmin) {
            localStorage.setItem("ADMIN_INFO", JSON.stringify(res.user));
            localStorage.removeItem(DOCTOR_INFO); // Remove any doctor info if exists
            navigate("/admin");
          } else {
            localStorage.setItem(DOCTOR_INFO, JSON.stringify(res.doctor));
            localStorage.removeItem("ADMIN_INFO"); // Remove any admin info if exists
            navigate("/dashboard");
          }
        } else {
          console.error("No authentication token received.");
          ToastManager.notify("Login failed. Please check your credentials.", {
            type: "error",
          });
        }
      },
      (err) => {
        console.log("err", err);
        const errorMessage =
          err.response?.data?.message || "Invalid email or password";
        ToastManager.notify(errorMessage, {
          type: "error",
          duration: 3000,
        });
      },
      () => {}
    );
  };

  return { state, updateProp, handleLogin };
};

export default Logic;
