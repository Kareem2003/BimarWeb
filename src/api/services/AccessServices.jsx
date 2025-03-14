import { $axios } from "../axios";

export const verifyLink = (payload, onSuccess, onError, onFinally) => {
  console.log("payload: ", payload);
  $axios
    .post(`/access/verify-link`, {
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

