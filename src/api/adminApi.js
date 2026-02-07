import axios from "./axiosInstance";

// Teachers
export const fetchTeachersApi = () => axios.get("/admin/teachers");
export const createTeacherApi = (data) => axios.post("/admin/teachers", data);

// Subjects
export const createSubjectApi = (data) => axios.post("/admin/subjects", data);
export const assignSubjectApi = (data) => axios.post("/admin/assign-subject", data);

// Semester
export const setSemesterApi = (data) => axios.post("/admin/set-semester", data);

// Willingness
export const approveWillingnessApi = (teacherId) =>
  axios.post("/admin/approve-willingness", { teacherId });

// Timetable
export const generateTimetableApi = () =>
  axios.post("/admin/generate-timetable");

export const freezeSemesterApi = (sectionId) =>
  axios.post("/admin/freeze-semester", { sectionId });

export const editTimetableApi = (id, data) =>
  axios.put(`/admin/edit-timetable/${id}`, data);
