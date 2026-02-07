import { useState, useEffect } from "react";
import FacultyLayout from "../../components/layout/FacultyLayout";
import Button from "../../components/ui/Button";
import SlotSelector from "../../components/timetable/SlotSelector";
import { useFacultyStore } from "../../store/facultyStore";

export default function WillingnessForm() {
  const { assignedSubjects, fetchAssignedSubjects, submitWillingness } =
    useFacultyStore();

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const days = [
    "Day Order 1",
    "Day Order 2",
    "Day Order 3",
    "Day Order 4",
    "Day Order 5",
  ];

  const [availability, setAvailability] = useState({
    "Day Order 1": [],
    "Day Order 2": [],
    "Day Order 3": [],
    "Day Order 4": [],
    "Day Order 5": [],
  });

  useEffect(() => {
    fetchAssignedSubjects();
  }, []);

  const handleSubmit = async () => {
    if (selectedSubjects.length === 0) {
      alert("Select at least 1 subject");
      return;
    }

    await submitWillingness({
      subjects: selectedSubjects,
      availability,
    });

    alert("Willingness submitted!");
  };

  return (
    <FacultyLayout>
      <h1 className="text-2xl font-semibold mb-4">Willingness Form</h1>

      <div className="bg-white p-6 rounded shadow max-w-3xl">
        <h2 className="text-xl font-bold mb-3">Select Preferred Subjects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {assignedSubjects.map((sub) => (
            <label key={sub._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={sub._id}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSubjects((prev) =>
                    prev.includes(value)
                      ? prev.filter((id) => id !== value)
                      : [...prev, value]
                  );
                }}
              />
              {sub.name} ({sub.code}) — {sub.role}
            </label>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-3">Select Availability</h2>

        {days.map((day) => (
          <div key={day} className="mb-4">
            <h3 className="font-semibold mb-2">{day}</h3>
            <SlotSelector
              selectedSlots={availability[day]}
              setSelectedSlots={(slots) =>
                setAvailability({ ...availability, [day]: slots })
              }
            />
          </div>
        ))}

        <Button onClick={handleSubmit} className="mt-4">
          Submit Willingness
        </Button>
      </div>
    </FacultyLayout>
  );
}
