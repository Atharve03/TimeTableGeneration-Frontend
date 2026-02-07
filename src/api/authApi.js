import axios from "./axiosInstance";

export const loginApi = (email, password) => {
  return axios.post("/auth/login", { email, password });
};

export const registerApi = (data) => {
  return axios.post("/auth/register", data);
};
