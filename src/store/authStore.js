import { create } from "zustand";
import axios from "../api/axiosInstance";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,

  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/auth/login", { email, password });

      const { user, token } = res.data;

      // Save to Zustand
      set({
        user,
        token,
        role: user.role,
        loading: false,
      });

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // Redirect based on role
      if (user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (user.role === "faculty") {
        window.location.href = "/faculty/dashboard";
      } else {
        alert("Invalid role in user data.");
        console.log("User object:", user);
      }

    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    set({ user: null, token: null, role: null });

    window.location.href = "/login";
  }
}));
