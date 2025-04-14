import { $axios, $axiosFormData } from "../axios";
// fetch the area dropdowns
export const doctorLogin = (payload, onSuccess, onError, onFinally) => {
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

export const verifyOTP = (payload, onSuccess, onError, onFinally) => {
  $axios
    .post(`/doctor/verify-otp`, {
      doctorEmail: payload.email,
      otp: payload.otp
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

export const doctorResetPassword = (payload, onSuccess, onError, onFinally) => {
  $axios
    .post(`/doctor/reset-password`, {
      email: payload.email,
      newPassword: payload.newPassword
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