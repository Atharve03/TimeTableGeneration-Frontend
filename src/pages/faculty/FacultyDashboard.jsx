import FacultyLayout from "../../components/layout/FacultyLayout";

export default function FacultyDashboard() {
  return (
    <FacultyLayout>
      <h1 className="text-3xl font-semibold mb-4">Faculty Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">My Subjects</h2>
          <p className="text-sm mt-2 text-gray-600">View your assigned theory & lab subjects.</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Willingness Form</h2>
          <p className="text-sm mt-2 text-gray-600">Submit preferred subjects & availability.</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">My Timetable</h2>
          <p className="text-sm mt-2 text-gray-600">Check your timetable for this semester.</p>
        </div>

      </div>
    </FacultyLayout>
  );
}
