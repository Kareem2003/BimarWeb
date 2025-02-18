import { reducer } from "../../reducers/reducer";
import { useEffect, useReducer } from "react";
import { INITIAL_STATE } from "./constant";

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorLogin } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";
const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

    useEffect(() => {
      const doctorData = localStorage.getItem(DOCTOR_INFO);
      if (doctorData && doctorData.trim().startsWith("{")) {
        try {
          const doctor = JSON.parse(doctorData);
          updateProp("doctorName", doctor.doctorName);
          updateProp("doctorEmail", doctor.doctorEmail);
          updateProp("doctorPhone", doctor.doctorPhone);
          updateProp("doctorDateOfBirth", doctor.doctorDateOfBirth);
          updateProp("nationalID", doctor.nationalID);
          updateProp("Gender", doctor.Gender);
          updateProp("syndicateID", doctor.syndicateID);
          updateProp("syndicateCard", doctor.syndicateCard);
          updateProp("yearsOfExprience", doctor.yearsOfExprience);
          updateProp("doctorImage", doctor.doctorImage);
          updateProp("field", doctor.field);
          updateProp("certificates", doctor.certificates);
          updateProp("clinic", doctor.clinic);
        } catch (error) {
          console.error("Error parsing doctor data from local storage:", error);
        }
      }
    }, []);

  return { state, updateProp };
};

export default Logic;
