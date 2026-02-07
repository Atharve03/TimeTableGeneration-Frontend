import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import MySubjects from "../pages/faculty/MySubjects";
import WillingnessForm from "../pages/faculty/WillingnessForm";
import FacultyTimetable from "../pages/faculty/FacultyTimetable";

export default function FacultyRoutes() {
  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <Routes>
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="subjects" element={<MySubjects />} />
        <Route path="willingness" element={<WillingnessForm />} />
        <Route path="timetable" element={<FacultyTimetable />} />
      </Routes>
    </ProtectedRoute>
  );
}
