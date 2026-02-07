import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar({ role }) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">{role === "admin" ? "Admin" : "Faculty"}</h2>

      {role === "admin" && (
        <>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/dashboard">Dashboard</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/teachers">Manage Teachers</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/subjects">Manage Subjects</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/assign-subject">Assign Subjects</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/semester">Set Semester</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/willingness">Approve Willingness</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/timetable/generate">Generate Timetable</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/admin/timetable/view">View Timetable</Link>
        </>
      )}

      {role === "faculty" && (
        <>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/faculty/dashboard">Dashboard</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/faculty/subjects">My Subjects</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/faculty/willingness">Willingness Form</Link>
          <Link className="py-2 hover:bg-gray-700 rounded" to="/faculty/timetable">My Timetable</Link>
        </>
      )}

      <button
        onClick={logout}
        className="mt-auto bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
