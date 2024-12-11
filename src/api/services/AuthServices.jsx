import { $axios } from "../axios";
// fetch the area dropdowns
export const fetchOTP = (payload, onSuccess, onError, onFinally) => {
  $axios
    .post(`/generate-otp`, {
      its_number: payload.its_number,
    })
    .then((response) => {
      onSuccess(response);
      //   console.log("API Service: ", response.data.result);
    })
    .catch((error) => {
      onError(error.response.data);
    })
    .finally(() => {
      onFinally();
    });
};

export const verifyOTP = (payload, onSuccess, onError, onFinally) => {
  $axios
    .post(`/verify-otp`, payload)
    .then((response) => {
      onSuccess(response);
      //   console.log("API Service: ", response.data.result);
    })
    .catch((error) => {
      onError(error.response.data);
    })
    .finally(() => {
      onFinally();
    });
};
