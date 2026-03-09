import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute       from "../components/layout/ProtectedRoute";
import AdminDashboard       from "../pages/admin/AdminDashboard";
import ManageTeachers       from "../pages/admin/ManageTeachers";
import ManageSubjects       from "../pages/admin/ManageSubjects";
import AssignSubjects       from "../pages/admin/AssignSubjects";
import SetSemester          from "../pages/admin/SetSemester";
import ApproveWillingness   from "../pages/admin/ApproveWillingness";
import GenerateTimetable    from "../pages/admin/GenerateTimetable";
import ViewTimetable        from "../pages/admin/ViewTimetable";
import EditTimetable        from "../pages/admin/EditTimetable";

export default function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Routes>
        <Route path="dashboard"           element={<AdminDashboard />} />
        <Route path="teachers"            element={<ManageTeachers />} />
        <Route path="subjects"            element={<ManageSubjects />} />
        <Route path="assign-subject"      element={<AssignSubjects />} />
        <Route path="semester"            element={<SetSemester />} />
        <Route path="willingness"         element={<ApproveWillingness />} />
        <Route path="timetable/generate"  element={<GenerateTimetable />} />
        <Route path="timetable/view"      element={<ViewTimetable />} />
        <Route path="timetable/edit"      element={<EditTimetable />} />
        <Route path="*"                   element={<Navigate to="dashboard" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}