import { $axios, $axiosFormData } from "../axios";
// fetch the area dropdowns

export const ProfileScreen = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
  $axios
    .put(`/doctor/updateDoctor`, {
      email: payload.email,
      doctorName: payload.newData.doctorName,
      doctorDateOfBirth: payload.newData.doctorDateOfBirth,
      doctorPhone: payload.newData.doctorPhone,
      doctorEmail: payload.newData.doctorEmail
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