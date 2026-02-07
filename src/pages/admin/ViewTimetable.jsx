import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import TimetableGrid from "../../components/timetable/TimetableGrid";
import { useTimetableStore } from "../../store/timetableStore";
import Loader from "../../components/ui/Loader";

export default function ViewTimetable() {
  const { departmentTimetable, fetchDepartmentTimetable } = useTimetableStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchDepartmentTimetable().then(() => setLoaded(true));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-6">Department Timetable</h1>

      {!loaded ? (
        <Loader />
      ) : (
        <TimetableGrid data={departmentTimetable} />
      )}
    </AdminLayout>
  );
}
