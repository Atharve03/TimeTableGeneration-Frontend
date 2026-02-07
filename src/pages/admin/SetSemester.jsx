import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAdminStore } from "../../store/adminStore";

export default function SetSemester() {
  const { setSemester } = useAdminStore();

  const [form, setForm] = useState({
    name: "",
    year: "",
    semester: "odd",
    department: "CSE"
  });

  const handleSubmit = async () => {
    await setSemester(form);

    setForm({
      name: "",
      year: "",
      semester: "odd",
      department: "CSE"
    });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Set Semester / Section</h1>

      <div className="bg-white p-6 rounded shadow max-w-lg">

        <Input
          label="Section Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="Academic Year"
          placeholder="2025"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />

        <label className="block mb-1 font-medium">Semester</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value })}
        >
          <option value="odd">Odd Semester</option>
          <option value="even">Even Semester</option>
        </select>

        <label className="block mb-1 font-medium">Department</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
          <option value="EEE">EEE</option>
        </select>

        <Button onClick={handleSubmit}>Create Section</Button>
      </div>
    </AdminLayout>
  );
}
