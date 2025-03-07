import { $axios } from "../axios";

// fetch the area dropdowns
export const verifyLink = (payload, onSuccess, onError, onFinally) => {
  console.log("payload: ", payload);
  $axios
    .post(`/access/verify-link`, {
      token: payload.token,
      doctorEmail: payload.doctorEmail,
      password: payload.password,
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
