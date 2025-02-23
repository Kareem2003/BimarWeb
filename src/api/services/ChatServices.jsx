import { $securedAxios } from "../axios";

// fetch the area dropdowns
export const doctorLogin = (payload, onSuccess, onError, onFinally) => {
  $securedAxios
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