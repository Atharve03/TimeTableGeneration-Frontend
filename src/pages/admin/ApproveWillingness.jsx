import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import { useAdminStore } from "../../store/adminStore";
import axios from "../../api/axiosInstance";

export default function ApproveWillingness() {
  const { teachers, fetchTeachers, approveWillingness } = useAdminStore();
  const [willingnessData, setWillingnessData] = useState([]);

  useEffect(() => {
    fetchTeachers();
    loadWillingness();
  }, []);

  const loadWillingness = async () => {
    const res = await axios.get("/admin/willingness");


    setWillingnessData(res.data);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Approve Willingness Forms</h1>

      <div className="bg-white p-6 rounded shadow">

        <table className="w-full border text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Teacher</th>
              <th className="border p-2">Subjects</th>
              <th className="border p-2">Availability</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {willingnessData.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.teacherId?.name}</td>

                <td className="border p-2">
                  {item.subjects.map((s) => (
                    <span key={s._id} className="block">{s.name}</span>
                  ))}
                </td>

                <td className="border p-2">
  {Object.entries(item.availability).map(([day, slots]) => (
    <div key={day}>
      <strong>{day}:</strong> {slots.join(", ")}
    </div>
  ))}
</td>


                <td className="border p-2 capitalize">{item.status}</td>

                <td className="border p-2">
                  {item.status !== "approved" && (
                    <Button onClick={() => approveWillingness(item.teacherId._id)}>
                      Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </AdminLayout>
  );
}
