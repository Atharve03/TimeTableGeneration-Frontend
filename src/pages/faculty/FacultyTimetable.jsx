import { useEffect } from "react";
import FacultyLayout from "../../components/layout/FacultyLayout";
import { useFacultyStore } from "../../store/facultyStore";
import Loader from "../../components/ui/Loader";
import TimetableGrid from "../../components/timetable/TimetableGrid";

export default function FacultyTimetable() {
  const { timetable, fetchFacultyTimetable, loading } = useFacultyStore();

  useEffect(() => {
    fetchFacultyTimetable();
  }, []);

  return (
    <FacultyLayout>
      <h1 className="text-2xl font-semibold mb-4">My Timetable</h1>
      {loading ? <Loader /> : <TimetableGrid data={timetable} />}
    </FacultyLayout>
  );
}
