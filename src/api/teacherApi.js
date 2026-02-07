import axios from "./axiosInstance";

// Assigned subjects
export const fetchTeacherSubjectsApi = () =>
  axios.get("/teachers/subjects");

// Willingness
export const submitWillingnessApi = (data) =>
  axios.post("/teachers/willingness", data);

// Faculty timetable
export const fetchTeacherTimetableApi = () =>
  axios.get("/teachers/timetable");
