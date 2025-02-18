import { $axios, $axiosFormData } from "../axios";
// fetch the area dropdowns
export const doctorLogin = (payload, onSuccess, onError, onFinally) => {
  console.log("Payload: ", onSuccess);
  $axios
    .post(`/doctor/doctorLogin`, {
      doctorEmail: payload.doctorEmail,
      doctorPassword: payload.doctorPassword,
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
export const doctorForgetPassword = (
  payload,
  onSuccess,
  onError,
  onFinally
) => {
  $axios
    .post(`/doctor/forget-password`, {
      doctorEmail: payload.doctorEmail,
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

export const doctorRegister = (payload, onSuccess, onError, onFinally) => {
  $axiosFormData
    .post(`/doctor/doctorRegister`, payload)
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
