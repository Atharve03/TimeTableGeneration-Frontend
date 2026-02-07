import AdminLayout from "../../components/layout/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Teachers</h2>
          <p>Manage teacher data, add/update teachers.</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          <p>Create subjects and assign them to faculty.</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Timetable</h2>
          <p>Generate, edit, and freeze semester timetable.</p>
        </div>

      </div>
    </AdminLayout>
  );
}
