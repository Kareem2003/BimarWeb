import { useState } from "react";

const Logic = () => {
  const [state, setState] = useState({
    newMedicine: "",
    medicines: [],
    hasAccess: false,
    patientEmail: "",
    accessDuration: 120,
    followUpDate: new Date().toISOString().split("T")[0],
    medicalRecords: null,
    prescriptions: [],
  });

  const updateProp = (prop, value) => {
    setState((prev) => ({ ...prev, [prop]: value }));
  };

  return {
    state,
    updateProp,
  };
};

export default Logic;
