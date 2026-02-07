export default function TimetableGrid({ data }) {
    const days = ["Day Order 1", "Day Order 2", "Day Order 3", "Day Order 4", "Day Order 5"];
    const slots = Array.from({ length: 10 }, (_, i) => i + 1);
  
    const getEntry = (day, slot) =>
      data.find((e) => e.day === day && e.slot === slot);
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center bg-white shadow rounded">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 border">Day Order</th>
              {slots.map((s) => (
                <th key={s} className="p-2 border">Slot {s}</th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border p-2 font-semibold bg-gray-100">{day}</td>
  
                {slots.map((slot) => {
                  const entry = getEntry(day, slot);
                  return (
                    <td key={slot} className="border p-2 h-20 align-top">
                      {entry ? (
                        <div>
                          <div className="font-bold text-blue-700">
                            {entry?.subjectId?.name}
                          </div>
                          <div className="text-sm text-gray-700">
                            {entry?.teacherId?.name}
                          </div>
                          {entry?.isLab && (
                            <div className="text-xs text-red-600 mt-1">(Lab)</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">Free</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  