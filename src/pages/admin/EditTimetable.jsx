import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Loader from "../../components/ui/Loader";
import axios from "../../api/axiosInstance";

export default function EditTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadTimetable = async () => {
    const res = await axios.get("/timetable/department");
    setTimetable(res.data);
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const handleUpdate = async () => {
    await axios.put(`/admin/edit-timetable/${editing._id}`, editing);
    setEditing(null);
    loadTimetable();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-6">Edit Timetable</h1>

      {!timetable.length ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Timetable Table */}
          <div className="bg-white p-4 rounded shadow">
            <table className="w-full border text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Day</th>
                  <th className="border p-2">Slot</th>
                  <th className="border p-2">Subject</th>
                  <th className="border p-2">Teacher</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {timetable.map((item) => (
                  <tr key={item._id}>
                    <td className="border p-2">{item.day}</td>
                    <td className="border p-2">{item.slot}</td>
                    <td className="border p-2">{item.subjectId?.name}</td>
                    <td className="border p-2">{item.teacherId?.name}</td>
                    <td className="border p-2">
                      <Button
                        className="bg-green-600"
                        onClick={() => setEditing(item)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Edit Entry</h2>

              <Input
                label="Day"
                value={editing.day}
                onChange={(e) => setEditing({ ...editing, day: e.target.value })}
              />

              <Input
                label="Slot"
                type="number"
                value={editing.slot}
                onChange={(e) => setEditing({ ...editing, slot: e.target.value })}
              />

              <Input
                label="Subject ID"
                value={editing.subjectId?._id}
                onChange={(e) => setEditing({ ...editing, subjectId: e.target.value })}
              />

              <Input
                label="Teacher ID"
                value={editing.teacherId?._id}
                onChange={(e) => setEditing({ ...editing, teacherId: e.target.value })}
              />

              <Button className="bg-blue-600 mt-3" onClick={handleUpdate}>
                Save Changes
              </Button>

              <Button
                className="bg-gray-600 mt-3 ml-3"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
            </div>
          )}

        </div>
      )}
    </AdminLayout>
  );
}
