export default function SlotSelector({ selectedSlots, setSelectedSlots }) {
    const slots = Array.from({ length: 10 }, (_, i) => i + 1);
  
    const toggleSlot = (slot) => {
      if (selectedSlots.includes(slot)) {
        setSelectedSlots(selectedSlots.filter((s) => s !== slot));
      } else {
        setSelectedSlots([...selectedSlots, slot]);
      }
    };
  
    return (
      <div className="flex flex-wrap gap-2">
        {slots.map((s) => (
          <button
            key={s}
            onClick={() => toggleSlot(s)}
            className={`px-3 py-1 rounded border ${
              selectedSlots.includes(s)
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Slot {s}
          </button>
        ))}
      </div>
    );
  }
  