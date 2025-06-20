import { $axios } from "../axios";

export const appRate = (payload, onSuccess, onError, onComplete) => {
  $axios
    .post("/rateApp/", {
      rating: payload.rating,
      comment: payload.comment,
    })
    .then(onSuccess)
    .catch((error) => {
      // Extract the error message
      const errorMessage = error.data?.[0] || "An error occurred"; // Access the first item in the data array
      onError(errorMessage); // Pass the string message to onError
    })
    .finally(onComplete);
};

export const getUserRating = (onSuccess, onError, onComplete) => {
  $axios
    .get("/rateApp/")
    .then(onSuccess)
    .catch((error) => {
      // Extract the error message
      const errorMessage = error.data?.[0] || "An error occurred"; // Access the first item in the data array
      onError(errorMessage); // Pass the string message to onError
    })
    .finally(onComplete);
};

export const updateUserRating = (payload, onSuccess, onError, onComplete) => {
  $axios
    .patch("/rateApp/", {
      rating: payload.rating,
      comment: payload.comment,
    })
    .then(onSuccess)
    .catch((error) => {
      // Extract the error message
      const errorMessage = error.data?.[0] || "An error occurred"; // Access the first item in the data array
      onError(errorMessage); // Pass the string message to onError
    })
    .finally(onComplete);
};
