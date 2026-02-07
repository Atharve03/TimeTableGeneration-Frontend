import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import { useAdminStore } from "../../store/adminStore";

export default function AssignSubjects() {
  const {
    teachers,
    subjects,
    fetchTeachers,
    fetchSubjects,
    assignSubject
  } = useAdminStore();

  const [form, setForm] = useState({
    teacherId: "",
    subjectId: "",
    role: "theory"
  });

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    await assignSubject(form);
    setForm({ teacherId: "", subjectId: "", role: "theory" });
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Assign Subjects to Teachers</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-2xl">

        {/* Teacher */}
        <label className="block mb-1">Select Teacher</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={form.teacherId}
          onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
        >
          <option value="">-- Select --</option>
          {(teachers || []).map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.designation})
            </option>
          ))}
        </select>

        {/* Subject */}
        <label className="block mb-1">Select Subject</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
        >
          <option value="">-- Select --</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name} ({sub.code})
            </option>
          ))}
        </select>

        {/* Role */}
        <label className="block mb-1">Role</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="theory">Theory Faculty</option>
          <option value="main">Main Lab Faculty</option>
          <option value="cofaculty">Co-Faculty (Lab)</option>
        </select>

        <Button onClick={handleSubmit}>Assign</Button>

      </div>
    </AdminLayout>
  );
}
