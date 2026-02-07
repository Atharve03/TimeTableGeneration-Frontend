import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useAdminStore } from "../../store/adminStore";

export default function GenerateTimetable() {
  const { generateTimetable, loading, timetable } = useAdminStore();
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    await generateTimetable();
    setGenerated(true);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-6">Generate Timetable</h1>

      <div className="bg-white p-6 rounded shadow max-w-md">
        <p className="mb-4 text-gray-700">
          Click below to start timetable generation.  
          Labs → Lectures → Conflict resolution → Save to DB.
        </p>

        <Button onClick={handleGenerate}>
          Generate Timetable
        </Button>

        {loading && <Loader />}

        {generated && !loading && (
          <p className="text-green-600 mt-3 font-semibold">
            Timetable generated successfully!
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
