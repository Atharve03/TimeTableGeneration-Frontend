import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAdminStore } from "../../store/adminStore";

export default function ManageSubjects() {
  const { subjects, fetchSubjects, createSubject } = useAdminStore();
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "theory",
    weeklyLectures: 3,
    isLab: false
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = () => {
    createSubject(form);
    setForm({
      name: "",
      code: "",
      type: "theory",
      weeklyLectures: 3,
      isLab: false
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Manage Subjects</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Add Subject Form */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-4">Add Subject</h2>

          <Input
            label="Subject Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            label="Subject Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <label className="block mb-1">Type</label>
          <select
            className="w-full border p-2 rounded mb-3"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
                isLab: e.target.value === "lab"
              })
            }
          >
            <option value="theory">Theory</option>
            <option value="lab">Lab</option>
          </select>

          <Input
            label="Weekly Lectures"
            type="number"
            value={form.weeklyLectures}
            onChange={(e) => setForm({ ...form, weeklyLectures: e.target.value })}
          />

          <Button onClick={handleSubmit}>Add Subject</Button>
        </div>

        {/* Subjects List */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-3">Subjects List</h2>

          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Weekly</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => (
                <tr key={sub._id}>
                  <td className="p-2 border">{sub.name}</td>
                  <td className="p-2 border">{sub.code}</td>
                  <td className="p-2 border">{sub.type}</td>
                  <td className="p-2 border">{sub.weeklyLectures}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </AdminLayout>
  );
}
