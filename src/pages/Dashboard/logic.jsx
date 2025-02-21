import { reducer } from "../../reducers/reducer";
import { useReducer, useEffect } from "react";
import { INITIAL_STATE } from "./constant";
import ACTION_TYPES from "../../reducers/actionTypes";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const updateProp = (prop, value) => {
    dispatch({
      payload: [
        {
          type: ACTION_TYPES.UPDATE_PROP,
          prop: prop,
          value: value,
        },
      ],
    });
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        // Fetch logged-in user data from localStorage
        const doctorData = localStorage.getItem("DOCTOR_INFO"); // Use the same key as in your application
        if (doctorData) {
          const doctor = JSON.parse(doctorData);
          updateProp("loggedInUser", doctor.doctorName); // Assuming doctor object has a doctorName property
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    getDashboardData();
  }, []);

  return {
    state,
    updateProp,
  };
};

export default Logic;
