import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";

import ACTION_TYPES from "../../reducers/actionTypes";
import { doctorLogin, doctorRegister } from "../../api/services/AuthServices";
import { ToastManager } from "../../helpers/ToastManager";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const navigate = useNavigate();

  const updateProp = (prop, value) => {
    dispatch({
      payload: [{ type: ACTION_TYPES.UPDATE_PROP, prop: prop, value: value }],
    });
  };

  // Function to validate phone number format
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^01[0-2,5]\d{8}$/; // Allows optional '+' and 10 to 15 digits
    return phoneRegex.test(phone);
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
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

  const handleRegister = () => {
    // Validate inputs
    const errorMessages = [];

    // Validate phone number
    if (!isValidPhoneNumber(state.doctorPhone)) {
      errorMessages.push("Invalid phone number format.");
    }

    // Validate email
    if (!isValidEmail(state.doctorEmail)) {
      errorMessages.push("Please enter a valid email address.");
    }

    // Validate clinic phone numbers
    state.clinic.forEach((clinic) => {
      if (
        !Array.isArray(clinic.clinicPhone) ||
        clinic.clinicPhone.length === 0
      ) {
        errorMessages.push("Clinic phone numbers must be an array.");
      }
    });

    // Validate price
    state.clinic.forEach((clinic) => {
      if (clinic.price <= 0) {
        errorMessages.push("Price must be a positive number.");
      }
    });

    // Check if there are any error messages
    if (errorMessages.length > 0) {
      ToastManager.notify(errorMessages.join(" "), { type: "error" });
      return; // Exit the function if there are errors
    }

    // Proceed with registration if no errors
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
      formData.append(`certificates`, file); // Use a consistent key for backend
    });

    // Append clinic data
    state.clinic.forEach((clinic, clinicIndex) => {
      formData.append(
        `clinic[${clinicIndex}][clinicLicense]`,
        clinic.clinicLicense
      );
      formData.append(`clinic[${clinicIndex}][clinicCity]`, clinic.clinicCity);
      formData.append(
        `clinic[${clinicIndex}][clinicWebsite]`,
        clinic.clinicWebsite
      );
      formData.append(
        `clinic[${clinicIndex}][clinicEmail]`,
        clinic.clinicEmail
      );
      formData.append(
        `clinic[${clinicIndex}][clinicLocationLinks]`,
        clinic.clinicLocationLinks
      );
      formData.append(`clinic[${clinicIndex}][clinicArea]`, clinic.clinicArea);
      formData.append(
        `clinic[${clinicIndex}][clinicAddress]`,
        clinic.clinicAddress
      );
      formData.append(
        `clinic[${clinicIndex}][clinicPhone]`,
        JSON.stringify(clinic.clinicPhone)
      ); // Store as a flat array
      formData.append(`clinic[${clinicIndex}][Price]`, clinic.price);

      // Append work days
      clinic.clinicWorkDays.forEach((workDay, workDayIndex) => {
        formData.append(
          `clinic[${clinicIndex}][clinicWorkDays][${workDayIndex}][day]`,
          workDay.day
        );
        formData.append(
          `clinic[${clinicIndex}][clinicWorkDays][${workDayIndex}][examinationDuration]`,
          workDay.examinationDuration
        );
        formData.append(
          `clinic[${clinicIndex}][clinicWorkDays][${workDayIndex}][NoBookings]`,
          workDay.NoBookings
        );
        workDay.workingHours.forEach((slot, slotIndex) => {
          formData.append(
            `clinic[${clinicIndex}][clinicWorkDays][${workDayIndex}][workingHours][${slotIndex}]`,
            `${slot.start} - ${slot.end}`
          );
        });
      });
    });

    // Debug FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send to backend
    doctorRegister(
      formData,
      (res) => {
        console.log("Registration successful:", res);
        ToastManager.notify("Registration successful!", {
          type: "success",
          duration: 5000,
        });
        navigate("/login"); // Use useNavigate hook
      },
      (err) => {
        console.error("Registration failed:", err);
        ToastManager.notify("Registration failed. Please try again.", {
          type: "error",
          duration: 5000,
        });
      },
      () => {}
    );
  };
  return { state, updateProp, handleRegister };
};

export default Logic;
