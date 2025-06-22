import axios from "axios";
import { BASE_URL } from "../helpers/constants/config";
import { AUTHENTICATION_TOKEN } from "../helpers/constants/StaticKeys";
import AppStorage from "../helpers/Storage";
import { ToastManager } from "../helpers/ToastManager";
// Helper function to generate common headers
const getCommonHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

export const $axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
  timeout: 20000, // Increase timeout if necessary
  withCredentials: true, // Include credentials (cookies) in requests
});

export const $axiosFormData = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds timeout,
  withCredentials: true, // Include credentials (cookies) in requests
});

export const $securedAxios = axios.create({
  baseURL: BASE_URL,
  headers: getCommonHeaders(),
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include credentials (cookies) in requests
});

export const $publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
  timeout: 20000,
});

const requestHandler = async (request) => {
  const authToken = await AppStorage.getItem(AUTHENTICATION_TOKEN);
  if (authToken) {
    request.headers.Authorization = `Bearer ${authToken}`;
  }
  return request;
};

const responseHandler = (response) => {
  return response.data;
};

const errHandler = (error) => {
  if (error.code === "ECONNABORTED") {
    return Promise.reject("Request timed out. Please try again.");
  }
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      // Handle token expiration and refresh logic here
    }
    return Promise.reject(data || "An error occurred");
  } else if (error.request) {
    ToastManager.notify("No response received from server.", {
      type: "error",
    });
    return Promise.reject("No response received from server.");
  } else {
    ToastManager.notify(error.message || "An error occurred", {
      type: "error",
    });
    return Promise.reject(error.message || "An error occurred");
  }
};

// UNSECURED RESPONSE HANDLER
$axios.interceptors.response.use(responseHandler, errHandler);

// PUBLIC RESPONSE HANDLER
$publicAxios.interceptors.response.use(responseHandler, errHandler);

// UNSECURED RESPONSE HANDLER
$axiosFormData.interceptors.response.use(responseHandler, errHandler);

// Add request interceptor to FormData for authentication
$axiosFormData.interceptors.request.use(requestHandler, errHandler);

// SECURED REQUEST HANDLER
$securedAxios.interceptors.request.use(requestHandler, errHandler);

// SECURED RESPONSE HANDLER
$securedAxios.interceptors.response.use(responseHandler, errHandler);
