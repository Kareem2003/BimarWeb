import { $axios } from "../axios";

export const fetchAppointments = (payload, onSuccess, onError, onFinally) => {
    // console.log("payload: ", payload);
    $axios
      .get(`/bookings/`)
      .then((response) => {
        // Parse the data to the correct format expected by the table
        onSuccess(response);
      })
      .catch((error) => {
        onError(error);
      })
      .finally(() => {
        onFinally();
      });
  };