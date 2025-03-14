import React, { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import Logic from "./logic";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { verifyLink } from "../../api/services/AccessServices";
import Cookies from "js-cookie";

const AccessScreen = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLink(
      {
        doctorEmail: "saramagdyy77@gmail.com",
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
          secureTextEntry={true} // Assuming password should always be secure
          onIconPress={() => {}}
          iconName="eye-slash" // Assuming the default icon for password visibility
          inputStyle="p-2"
          inputWrapperStyle="mt-10 mb-10"
          type="password"
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
