import { $axios } from "../axios";

// fetch the area dropdowns
export const generateLink = (payload, onSuccess, onError, onFinally) => {
  console.log("payload: ", payload);
  $axios
    .post(`/access/generate-link`, {
        patientEmail: payload.patientEmail,
        doctorEmail: payload.doctorEmail,
        accessDuration: payload.accessDuration
    })
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const createPrescription = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
    $axios
      .post(`http://localhost:3000/Diagnosis/${payload.patientId}`, payload.prescriptionData)
      .then((response) => {
        onSuccess(response);
      })
      .catch((error) => {
        onError(error);
      })
      .finally(() => {
        onFinally();
      });
  };
