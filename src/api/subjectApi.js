import axios from "./axiosInstance";

export const fetchSubjectsApi = () => axios.get("/subjects");
