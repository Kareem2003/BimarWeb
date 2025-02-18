import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorLogin, doctorRegister } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";
import axios from "axios";
import { Navigate } from "react-router-dom";
const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };
  const validateInputs = () => {
    if (
      !state.doctorName ||
      !state.doctorEmail ||
      !state.doctorPhone ||
      !state.doctorPassword ||
      !state.doctorDateOfBirth ||
      !state.nationalID ||
      !state.Gender ||
      !state.syndicateID ||
      !state.syndicateCard ||
      !state.yearsOfExprience ||
      !state.doctorImage ||
      !state.field ||
      !state.certificates ||
      !state.clinic
    ) {
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

  // const handleRegister = () => {
  //   if (!validateInputs()) return;
  //   doctorRegister(
  //     {
  //       doctorName: state.doctorName,
  //       doctorEmail: state.doctorEmail,
  //       doctorPhone: state.doctorPhone,
  //       doctorPassword: state.doctorPassword,
  //       doctorDateOfBirth: state.doctorDateOfBirth,
  //       nationalID: state.nationalID,
  //       Gender: state.Gender,
  //       syndicateID: state.syndicateID,
  //       syndicateCard: state.syndicateCard,
  //       yearsOfExprience: state.yearsOfExprience,
  //       doctorImage: state.doctorImage,
  //       field: state.field,
  //       certificates: state.certificates,
  //       clinic: state.clinic,
  //     },
  //     (res) => {
  //       ToastManager.notify("Registration successful!", { type: "success" });
  //       console.log(res);
  //     },
  //     (err) => {
  //       ToastManager.notify("Registration failed. Please try again.", { type: "error" });
  //       console.log(err);
  //     },
  //     () => {}
  //   );
  // };

  const handleRegister = () => {
    const formData = new FormData();

    // Append text fields
    formData.append("doctorName", state.doctorName);
    formData.append("doctorDateOfBirth", state.doctorDateOfBirth);
    formData.append("doctorPhone", state.doctorPhone);
    formData.append("doctorEmail", state.doctorEmail);
    formData.append("doctorPassword", state.doctorPassword);
    formData.append("nationalID", state.nationalID);
    formData.append("Gender", state.Gender);
    formData.append("field", state.field);
    formData.append("yearsOfExprience", state.yearsOfExprience);
    formData.append("syndicateID", state.syndicateID);
    formData.append("doctorImage", state.doctorImage);
    formData.append("syndicateCard", state.syndicateCard);
    state.certificates.forEach((file, index) => {
      formData.append(`certificates`, file);
    });

    // Append clinic data
    state.clinic.forEach((clinic, index) => {
      formData.append(`clinic[${index}][clinicLicense]`, clinic.clinicLicense);
      formData.append(`clinic[${index}][clinicCity]`, clinic.clinicCity);
      formData.append(`clinic[${index}][clinicArea]`, clinic.clinicArea);
      formData.append(`clinic[${index}][clinicAddress]`, clinic.clinicAddress);
      formData.append(`clinic[${index}][clinicPhone]`, clinic.clinicPhone[0]);
      formData.append(`clinic[${index}][clinicEmail]`, clinic.clinicEmail);
      formData.append(`clinic[${index}][clinicWebsite]`, clinic.clinicWebsite);
      formData.append(
        `clinic[${index}][clinicOpeningHours]`,
        clinic.clinicOpeningHours[0]
      );
      formData.append(
        `clinic[${index}][clinicWorkDays]`,
        clinic.clinicWorkDays[0]
      );
      formData.append(
        `clinic[${index}][clinicLocationLinks]`,
        clinic.clinicLocationLinks
      );
    });

    doctorRegister(
      formData,
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );

    // // Send the form data to the backend
    // axios
    //   .post("/doctor/register", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then((res) => {
    //     ToastManager.notify("Registration successful!", { type: "success" });
    //     Navigate("/login");
    //   })
    //   .catch((err) => {
    //     console.error("Registration failed:", err);
    //     ToastManager.notify("Registration failed. Please try again.", {
    //       type: "error",
    //     });
    //   });
  };
  return { state, updateProp, handleRegister };
};

export default Logic;
