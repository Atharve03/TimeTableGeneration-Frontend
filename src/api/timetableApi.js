import axios from "./axiosInstance";

// Section timetable
export const fetchSectionTimetableApi = (sectionId) =>
  axios.get(`/timetable/section/${sectionId}`);

// Batch timetable
export const fetchBatchTimetableApi = (batchId) =>
  axios.get(`/timetable/batch/${batchId}`);

// Department timetable
export const fetchDepartmentTimetableApi = () =>
  axios.get("/timetable/department");
