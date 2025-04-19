import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logic from "./logic";
import AppInput from "../../components/AppInput1";
import AppButton from "../../components/AppButton";
import { verifyLink } from "../../api/services/AccessServices";
import Cookies from "js-cookie";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";

const AccessScreen = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const navigate = useNavigate();
  const { state, updateProp } = Logic();

  // Get doctor email from local storage
  useEffect(() => {
    const doctorData = localStorage.getItem(DOCTOR_INFO);
    if (doctorData && doctorData.trim().startsWith("{")) {
      try {
        const doctor = JSON.parse(doctorData);
        setDoctorEmail(doctor.doctorEmail);
      } catch (error) {
        console.error("Error parsing doctor data:", error);
        setDoctorEmail("bimar.med24@gmail.com"); // Fallback to default email
        // Show error toast or message if needed
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLink(
      {
        doctorEmail: doctorEmail, // Use the dynamic doctor email
        password,
      },
      (res) => {
        console.log("Res: ", res);
        if (res.valid) {
          navigate("/medicalRecords", { state: { data: res.information } }); // Navigate with data
        }
      },
      (err) => {
        console.log("error: ", err);
      },
      () => {}
    );
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Medical Records Access</h2>
      <div className="mb-4">
        <label>Enter access password provided by the patient:</label>
        <AppInput
          term={password}
          onChangeText={(e) => setPassword(e.target.value)}
          placeholder="Password"
          secureTextEntry={!state.showPassword}
          onIconPress={() => {
            updateProp("showPassword", !state.showPassword);
          }}
          iconName={state.showPassword ? "eye" : "eye-slash"}
          inputStyle="p-2"
          inputWrapperStyle="mt-10 mb-10"
          type={state.showPassword ? "text" : "password"}
        />
      </div>
      <AppButton
        title="Verify Access"
        onPress={handleSubmit}
        buttonStyle="w-full py-2 bg-blue-600 text-white rounded"
      />
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <div className="mt-5 text-sm text-gray-600">
        <p>
          ℹ️ The access password is valid for 10 minutes after being requested.
        </p>
        <p>Contact support at bimar.med24@gmail.com for assistance.</p>
      </div>
    </div>
  );
};

export default AccessScreen;
