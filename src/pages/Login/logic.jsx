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
        console.log("document.cookie: ", res);
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="));
        if (token) {
          const authToken = token.split("=")[1]; // Get the token value
          localStorage.setItem(AUTHENTICATION_TOKEN, authToken);
          localStorage.setItem(DOCTOR_INFO, JSON.stringify(res.doctor));
          navigate("/"); // Use the navigate function
          ToastManager.notify(res.data, { type: res.status });
        } else {
          console.error("No authentication token received.");
          ToastManager.notify("Error happened while logging in!", {
            type: "error",
          });
        }
      },
      (err) => {
        console.log("err", err);
      },
      () => {}
    );
    console.log("Logging in with", state.doctorEmail, state.doctorPassword);
  };

  return { state, updateProp, handleLogin };
};

export default Logic;
