import { create } from "zustand";
import axios from "../api/axiosInstance";

export const useAdminStore = create((set) => ({
  teachers: [],
  subjects: [],
  sections: [],
  timetable: [],
  loading: false,
  error: null,

  fetchTeachers: async () => {
    try {
      const res = await axios.get("/admin/teachers");
      set({ teachers: res.data });
    } catch (err) {
      set({ error: "Error fetching teachers" });
    }
  },

  fetchSubjects: async () => {
    try {
      const res = await axios.get("/admin/subjects");  // FIXED ✔
      set({ subjects: res.data });
    } catch (err) {
      set({ error: "Error loading subjects" });
    }
  },

  createTeacher: async (data) => {
    try {
      await axios.post("/admin/teachers", data);
      await useAdminStore.getState().fetchTeachers();
    } catch (err) {
      set({ error: "Error creating teacher" });
    }
  },

  createSubject: async (data) => {
    try {
      await axios.post("/admin/subjects", data);
      await useAdminStore.getState().fetchSubjects();
    } catch (err) {
      set({ error: "Error creating subject" });
    }
  },

  assignSubject: async (data) => {
    try {
      await axios.post("/admin/assign-subject", data);
    } catch (err) {
      set({ error: "Error assigning subject" });
    }
  },

  setSemester: async (data) => {
    try {
      await axios.post("/admin/set-semester", data);
    } catch {
      set({ error: "Error setting semester" });
    }
  },

  approveWillingness: async (teacherId) => {
    try {
      await axios.post("/admin/approve-willingness", { teacherId });
    } catch {
      set({ error: "Error approving willingness" });
    }
  },

  generateTimetable: async () => {
    set({ loading: true });
    try {
      const res = await axios.post("/admin/generate-timetable");
      set({ timetable: res.data.result, loading: false });
    } catch {
      set({ loading: false, error: "Error generating timetable" });
    }
  },

  freezeSemester: async (sectionId) => {
    try {
      await axios.post("/admin/freeze-semester", { sectionId });
    } catch {
      set({ error: "Error freezing semester" });
    }
  }
}));
