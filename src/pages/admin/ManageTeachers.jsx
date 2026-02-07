import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAdminStore } from "../../store/adminStore";

export default function ManageTeachers() {
  const { teachers, fetchTeachers, createTeacher } = useAdminStore();

  const [form, setForm] = useState({
    name: "",
    email: "",   // <-- ADD EMAIL
    designation: "Assistant Professor",
    priority: 1
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async () => {
    await createTeacher(form);

    setForm({
      name: "",
      email: "",
      designation: "Assistant Professor",
      priority: 1
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Manage Teachers</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Add Teacher Form */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-3">Add Teacher</h2>

          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block mb-1">Designation</label>
          <select
            className="w-full border p-2 rounded mb-3"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          >
            <option>Professor</option>
            <option>Associate Professor</option>
            <option>Assistant Professor</option>
          </select>

          <Input
            label="Priority"
            type="number"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          />

          <Button onClick={handleSubmit}>Add Teacher</Button>
        </div>

        {/* Teacher List */}
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl font-bold mb-3">Teachers List</h2>

          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th> {/* <-- SHOW EMAIL */}
                <th className="p-2 border">Designation</th>
                <th className="p-2 border">Priority</th>
              </tr>
            </thead>

            <tbody>
              {(teachers || []).map((t) => (
                <tr key={t._id}>
                  <td className="p-2 border">{t.name}</td>
                  <td className="p-2 border">{t.email}</td> {/* <-- FIX */}
                  <td className="p-2 border">{t.designation}</td>
                  <td className="p-2 border">{t.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </AdminLayout>
  );
}
