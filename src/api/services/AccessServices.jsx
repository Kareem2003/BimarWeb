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

export const updateMedicalRecord = (payload, onSuccess, onError, onFinally) => {
  console.log("payload: ", payload);
  $axios
    .put(`/medical-records/update/${payload.patientId}`, payload.body)
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

export const getMedicalRecord = (payload, onSuccess, onError, onFinally) => {
  $axios
    .get(`/medical-records`)
    .then((response) => {
      console.log("response: ", response);
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const updateAppointment = (payload, onSuccess, onError, onFinally) => {
  $axios
    .patch(`/bookings/`, payload)
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