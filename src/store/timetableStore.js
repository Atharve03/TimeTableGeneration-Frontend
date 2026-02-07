import { create } from "zustand";
import axios from "../api/axiosInstance";

export const useTimetableStore = create((set) => ({
  sectionTimetable: [],
  batchTimetable: [],
  departmentTimetable: [],

  fetchSectionTimetable: async (sectionId) => {
    const res = await axios.get(`/timetable/section/${sectionId}`);
    set({ sectionTimetable: res.data });
  },

  fetchBatchTimetable: async (batchId) => {
    const res = await axios.get(`/timetable/batch/${batchId}`);
    set({ batchTimetable: res.data });
  },

  fetchDepartmentTimetable: async () => {
    const res = await axios.get("/timetable/department");
    set({ departmentTimetable: res.data });
  }
}));
