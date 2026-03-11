import { useEffect, useState } from "react";
import FacultyLayout from "../../components/layout/FacultyLayout";
import { useFacultyStore } from "../../store/facultyStore";
import TimetableGrid from "../../components/timetable/TimetableGrid";

const DAYS = [
  "Day Order 1", "Day Order 2", "Day Order 3",
  "Day Order 4", "Day Order 5",
];

const TIME_SLOTS = [
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

const btnBase   = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150";
const activeBtn = "bg-blue-600 text-white shadow-sm shadow-blue-500/20";
const inactiveBtn = "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.1]";

export default function FacultyTimetable() {
  const { timetable, fetchFacultyTimetable, loading } = useFacultyStore();
  const [view,      setView]      = useState("grid");
  const [todayDO,   setTodayDO]   = useState(0);
  const [dayFilter, setDayFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("all");  // NEW

  useEffect(() => { fetchFacultyTimetable(); }, []);

  // Unique sems in timetable
  const sems = [...new Set(
    (timetable || []).map((e) => e.subjectId?.sem).filter(Boolean)
  )].sort((a, b) => a - b);

  // Apply sem filter
  const semFiltered = semFilter === "all"
    ? (timetable || [])
    : (timetable || []).filter((e) => String(e.subjectId?.sem) === semFilter);

  // Apply day filter on top of sem filter (for list view)
  const listData = dayFilter === "all"
    ? semFiltered
    : semFiltered.filter((e) => e.day === dayFilter);

  const sorted = [...listData].sort((a, b) => {
    const di = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    return di !== 0 ? di : a.slot - b.slot;
  });

  return (
    <FacultyLayout title="My Timetable">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Timetable
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            Your allocated classes across all day orders
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("grid")} className={`${btnBase} ${view==="grid"?activeBtn:inactiveBtn}`}>⊞ Grid</button>
          <button onClick={() => setView("list")} className={`${btnBase} ${view==="list"?activeBtn:inactiveBtn}`}>☰ List</button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-ring" />
          <p className="text-sm text-gray-400">Loading timetable…</p>
        </div>
      ) : !timetable?.length ? (
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-12 text-center">
          <span className="text-5xl block mb-4 animate-float">🗓</span>
          <p className="text-base font-bold text-gray-700 dark:text-slate-300">No timetable yet</p>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
            Submit your willingness form first, then the admin will generate your timetable.
          </p>
        </div>
      ) : (
        <>
          {/* ── Semester filter tabs ── */}
          {sems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600">Semester:</span>
              <button onClick={() => setSemFilter("all")}
                className={`${btnBase} ${semFilter==="all"?activeBtn:inactiveBtn}`}>
                All
              </button>
              {sems.map((s) => (
                <button key={s} onClick={() => setSemFilter(String(s))}
                  className={`${btnBase} ${semFilter===String(s)?activeBtn:inactiveBtn}`}>
                  Sem {s}
                </button>
              ))}
            </div>
          )}

          {/* ── GRID VIEW ── */}
          {view === "grid" && (
            <>
              {/* Highlight day order */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600">Highlight:</span>
                {[0,1,2,3,4,5].map((d) => (
                  <button key={d} onClick={() => setTodayDO(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border transition-all
                      ${todayDO===d
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "bg-gray-100 dark:bg-white/[0.06] border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400"
                      }`}>
                    {d===0 ? "None" : `DO ${d}`}
                  </button>
                ))}
              </div>

              <TimetableGrid data={semFiltered} todayDO={todayDO || null} />
            </>
          )}

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <>
              {/* Day filter */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["all",...DAYS].map((d) => (
                  <button key={d} onClick={() => setDayFilter(d)}
                    className={`${btnBase} ${dayFilter===d?activeBtn:inactiveBtn}`}>
                    {d==="all" ? "All Days" : d.replace("Day Order ","DO ")}
                  </button>
                ))}
              </div>

              {!sorted.length ? (
                <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-10 text-center">
                  <p className="text-sm text-gray-400">No classes found for selected filters.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sorted.map((e, i) => {
                    const ts = TIME_SLOTS.find((t) => t.s === e.slot);
                    return (
                      <div key={e._id || i}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all animate-fade-up
                          ${e.isLab
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20"
                          }`}
                        style={{ animationDelay: `${(i % 5) * 60}ms` }}>

                        {/* Slot badge */}
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center
                          text-xs font-extrabold font-mono
                          ${e.isLab
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400"
                          }`}>
                          S{e.slot}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">
                            {e.subjectId?.name || "Subject"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            {ts && <span className="text-xs font-mono text-gray-400 dark:text-slate-500">{ts.f}–{ts.t}</span>}
                            <span className="text-gray-300 dark:text-slate-700 text-xs">·</span>
                            <span className="text-xs text-gray-400 dark:text-slate-500">
                              {e.day?.replace("Day Order ","DO ")}
                            </span>
                            {e.subjectId?.sem && (
                              <>
                                <span className="text-gray-300 dark:text-slate-700 text-xs">·</span>
                                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                                  Sem {e.subjectId.sem}
                                </span>
                              </>
                            )}
                            {e.subjectId?.program && (
                              <>
                                <span className="text-gray-300 dark:text-slate-700 text-xs">·</span>
                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                                  {e.subjectId.program}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0
                          ${e.isLab
                            ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400"
                          }`}>
                          {e.isLab ? "🔬 Lab" : "📖 Theory"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
    </FacultyLayout>
  );
}