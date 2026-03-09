export const TIME_SLOTS = [
  { s: 1,  f: "08:00", t: "08:50" },
  { s: 2,  f: "08:50", t: "09:40" },
  { s: 3,  f: "09:45", t: "10:35" },
  { s: 4,  f: "10:40", t: "11:30" },
  { s: 5,  f: "11:35", t: "12:25" },
  { s: 6,  f: "12:30", t: "01:20" },
  { s: 7,  f: "01:25", t: "02:15" },
  { s: 8,  f: "02:20", t: "03:10" },
  { s: 9,  f: "03:10", t: "04:00" },
  { s: 10, f: "04:00", t: "04:50" },
];

export const DAYS = [
  "Day Order 1", "Day Order 2", "Day Order 3",
  "Day Order 4", "Day Order 5",
];

export default function TimetableGrid({ data = [], todayDO = null }) {
  const get = (day, slot) => data.filter((e) => e.day === day && e.slot === slot);

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/[0.07] animate-fade-up">
      <table className="w-full border-collapse" style={{ minWidth: 900 }}>
        <thead>
          <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.07]">
            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest
              text-gray-400 dark:text-slate-600 w-28 sticky left-0
              bg-gray-50 dark:bg-[#0f1626] z-10">
              Day / Slot
            </th>
            {TIME_SLOTS.map((ts) => (
              <th key={ts.s} className="px-2 py-3 text-center min-w-[80px]">
                <p className="text-xs font-bold text-gray-600 dark:text-slate-400">S{ts.s}</p>
                <p className="text-[9px] font-mono text-gray-400 dark:text-slate-600 mt-0.5">{ts.f}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day, di) => {
            const isToday = todayDO === di + 1;
            return (
              <tr key={day}
                className={`border-b border-gray-100 dark:border-white/[0.04] last:border-0 transition-colors
                  ${isToday ? "bg-blue-50/60 dark:bg-blue-500/[0.05]" : ""}`}>

                <td className={`px-4 py-2 sticky left-0 z-10
                  border-r border-gray-100 dark:border-white/[0.04]
                  ${isToday ? "bg-blue-50 dark:bg-blue-500/10" : "bg-gray-50 dark:bg-[#0f1626]"}`}>
                  {isToday && (
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-blue-500 mb-0.5 font-mono">
                      TODAY
                    </span>
                  )}
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">
                    DO {di + 1}
                  </span>
                </td>

                {TIME_SLOTS.map((ts) => {
                  const entries = get(day, ts.s);
                  return (
                    <td key={ts.s}
                      className="p-1 align-top border-r border-gray-100 dark:border-white/[0.04] last:border-0"
                      style={{ height: 68 }}>
                      {entries.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-gray-200 dark:text-white/10 text-xs">·</span>
                        </div>
                      ) : (
                        entries.map((e, ei) => (
                          <div key={ei}
                            title={`${e.subjectId?.name} — ${e.teacherId?.name}`}
                            className={`rounded-lg px-2 py-1.5 h-[58px] flex flex-col justify-center
                              cursor-default transition-transform hover:scale-105 hover:z-10
                              relative overflow-hidden
                              ${ei > 0 ? "mt-1" : ""}
                              ${e.isLab
                                ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                                : "bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20"
                              }`}>
                            <p className={`text-[11px] font-bold leading-tight truncate
                              ${e.isLab ? "text-emerald-700 dark:text-emerald-400" : "text-violet-700 dark:text-violet-400"}`}>
                              {e.subjectId?.code || e.subjectId?.name?.slice(0, 8) || "—"}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-slate-500 truncate mt-0.5">
                              {e.teacherId?.name?.split(" ").pop() || "—"}
                            </p>
                            {e.isLab && (
                              <p className="text-[9px] font-bold text-emerald-500 font-mono mt-0.5">LAB</p>
                            )}
                          </div>
                        ))
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}