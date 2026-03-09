export default function SlotSelector({ selectedSlots = [], setSelectedSlots }) {
  const toggle = (s) =>
    setSelectedSlots(
      selectedSlots.includes(s)
        ? selectedSlots.filter((x) => x !== s)
        : [...selectedSlots, s]
    );

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => {
        const on = selectedSlots.includes(s);
        return (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`w-9 h-9 rounded-lg text-xs font-bold font-mono
              border transition-all duration-150 active:scale-95
              ${on
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                : "bg-gray-100 dark:bg-white/[0.05] border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400"
              }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}