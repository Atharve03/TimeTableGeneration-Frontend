import { create } from "zustand";
import axios from "../api/axiosInstance";

export const useFacultyStore = create((set) => ({
  assignedSubjects: [],
  timetable: [],
  loading: false,
  error: null,

  fetchAssignedSubjects: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/teachers/subjects");
      set({ assignedSubjects: res.data.subjects, loading: false });
    } catch (err) {
      set({ loading: false, error: "Failed to load assigned subjects" });
    }
  },

  submitWillingness: async (data) => {
    try {
      await axios.post("/teachers/willingness", data);
    } catch {
      set({ error: "Error submitting willingness" });
    }
  },

  fetchFacultyTimetable: async () => {
    try {
      const res = await axios.get("/teachers/timetable");
      set({ timetable: res.data.timetable });
    } catch {
      set({ error: "Error fetching timetable" });
    }
  }
}));
