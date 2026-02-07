import { useEffect } from "react";
import FacultyLayout from "../../components/layout/FacultyLayout";
import { useFacultyStore } from "../../store/facultyStore";
import Loader from "../../components/ui/Loader";

export default function MySubjects() {
  const { assignedSubjects, fetchAssignedSubjects, loading } = useFacultyStore();

  useEffect(() => {
    fetchAssignedSubjects();
  }, []);

  return (
    <FacultyLayout>
      <h1 className="text-2xl font-semibold mb-4">My Subjects</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {assignedSubjects.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.name}</td>   {/* FIXED */}
                  <td className="border p-2">{item.code}</td>   {/* FIXED */}
                  <td className="border p-2 capitalize">
                    {item.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FacultyLayout>
  );
}
