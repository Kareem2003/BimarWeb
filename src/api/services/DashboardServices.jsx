import { $axios } from "../axios";

export const fetchDashboardData = async () => {
  const response = await $axios.get("/dashboard"); // Adjust the endpoint as necessary
  return response.data;
};
