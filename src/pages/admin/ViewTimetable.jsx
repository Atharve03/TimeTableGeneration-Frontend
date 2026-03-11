import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "../../api/axiosInstance";

const DAYS  = ["Day Order 1","Day Order 2","Day Order 3","Day Order 4","Day Order 5"];
const SLOTS = Array.from({ length: 10 }, (_, i) => i + 1);
const TIME_LABELS = ["08:00","08:50","09:45","10:40","11:35","12:30","01:25","02:20","03:10","04:00"];

const DESIGNATION_COLOR = {
  "Professor":            { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-500", badge: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  "Associate Professor":  { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-500",   badge: "bg-blue-500/10 text-blue-500 border-blue-500/20"   },
  "Assistant Professor":  { bg: "bg-emerald-500/10",border: "border-emerald-500/30",text: "text-emerald-500",badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"},
};

const LECTURE_LIMITS = { "Professor": 7, "Associate Professor": 14, "Assistant Professor": 18 };

function DesignationBadge({ designation }) {
  const c = DESIGNATION_COLOR[designation] || DESIGNATION_COLOR["Assistant Professor"];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
      {designation}
    </span>
  );
}

function WorkloadBar({ used, limit }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 100 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/[0.07] overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500 shrink-0">
        {used}/{limit}
      </span>
    </div>
  );
}

export default function ViewTimetable() {
  const [teachers,       setTeachers]       = useState([]);
  const [selectedTeacher,setSelectedTeacher]= useState(null);
  const [timetable,      setTimetable]      = useState([]);
  const [loadingList,    setLoadingList]    = useState(true);
  const [loadingTT,      setLoadingTT]      = useState(false);
  const [search,         setSearch]         = useState("");

  // Load faculty list
  useEffect(() => {
    axios.get("/timetable/teachers")
      .then((r) => setTeachers(r.data))
      .catch(() => setTeachers([]))
      .finally(() => setLoadingList(false));
  }, []);

  // Load timetable for selected teacher
  useEffect(() => {
    if (!selectedTeacher) return;
    setLoadingTT(true);
    axios.get(`/timetable/teacher/${selectedTeacher._id}`)
      .then((r) => setTimetable(r.data))
      .catch(() => setTimetable([]))
      .finally(() => setLoadingTT(false));
  }, [selectedTeacher]);

  const getEntry = (day, slot) =>
    timetable.find((e) => e.day === day && e.slot === slot);

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.designation?.toLowerCase().includes(search.toLowerCase())
  );

  // Group teachers by designation
  const groups = [
    { label: "Professor",           items: filtered.filter((t) => t.designation === "Professor") },
    { label: "Associate Professor", items: filtered.filter((t) => t.designation === "Associate Professor") },
    { label: "Assistant Professor", items: filtered.filter((t) => t.designation === "Assistant Professor") },
  ].filter((g) => g.items.length > 0);

  const limit = LECTURE_LIMITS[selectedTeacher?.designation] || 18;
  const theoryCount = timetable.filter((e) => !e.isLab).length;
  const labCount    = timetable.filter((e) =>  e.isLab).length;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">📅 Admin</p>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Faculty Timetables
          </h1>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
            Select a faculty member to view their full timetable
          </p>
        </div>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── LEFT: Faculty list ── */}
        <div className="w-72 shrink-0">
          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl
                bg-white dark:bg-[#0f1626]
                border border-gray-200 dark:border-white/[0.08]
                text-gray-800 dark:text-slate-200
                placeholder-gray-400 dark:placeholder-slate-600
                focus:outline-none focus:border-blue-400 dark:focus:border-blue-500/50
                transition-colors"
            />
          </div>

          <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
            {loadingList ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin" />
                <span className="text-sm text-gray-400">Loading…</span>
              </div>
            ) : !teachers.length ? (
              <div className="py-12 text-center">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-sm text-gray-400 dark:text-slate-500">No timetable generated yet</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[72vh]">
                {groups.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/[0.05]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600">
                        {group.label}
                      </p>
                    </div>
                    {group.items.map((teacher) => {
                      const c   = DESIGNATION_COLOR[teacher.designation] || DESIGNATION_COLOR["Assistant Professor"];
                      const sel = selectedTeacher?._id === teacher._id;
                      const lim = LECTURE_LIMITS[teacher.designation] || 18;
                      return (
                        <button
                          key={teacher._id}
                          onClick={() => setSelectedTeacher(teacher)}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-white/[0.04]
                            transition-all last:border-0
                            ${sel
                              ? `${c.bg} border-l-2 ${c.border}`
                              : "hover:bg-gray-50 dark:hover:bg-white/[0.02] border-l-2 border-transparent"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0
                              ${sel ? `${c.bg} border ${c.border} ${c.text}` : "bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-slate-500"}`}>
                              {teacher.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${sel ? c.text : "text-gray-800 dark:text-slate-200"}`}>
                                {teacher.name}
                              </p>
                              <WorkloadBar used={teacher.totalSlots} limit={lim} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 ml-10">
                            <span className="text-[10px] text-gray-400 dark:text-slate-600 font-mono">
                              📖 {teacher.totalSlots - teacher.labSlots} theory
                            </span>
                            {teacher.labSlots > 0 && (
                              <span className="text-[10px] text-emerald-500 font-mono">
                                🔬 {teacher.labSlots} lab
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Timetable grid ── */}
        <div className="flex-1 min-w-0">
          {!selectedTeacher ? (
            <div className="flex items-center justify-center h-[60vh]
              bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
              rounded-2xl border-dashed">
              <div className="text-center">
                <span className="text-5xl block mb-3">👈</span>
                <p className="text-base font-bold text-gray-500 dark:text-slate-400">Select a faculty member</p>
                <p className="text-sm text-gray-400 dark:text-slate-600 mt-1">Their timetable will appear here</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-up">

              {/* Teacher header */}
              <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
                rounded-2xl p-5 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const c = DESIGNATION_COLOR[selectedTeacher.designation] || DESIGNATION_COLOR["Assistant Professor"];
                      return (
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-extrabold ${c.bg} border ${c.border} ${c.text}`}>
                          {selectedTeacher.name.charAt(0).toUpperCase()}
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                        {selectedTeacher.name}
                      </h2>
                      <DesignationBadge designation={selectedTeacher.designation} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-3">
                    {[
                      { label: "Theory",    value: theoryCount, icon: "📖", color: "blue"    },
                      { label: "Lab",       value: labCount,    icon: "🔬", color: "emerald"  },
                      { label: "Limit",     value: limit,       icon: "📊", color: "violet"   },
                    ].map((s) => (
                      <div key={s.label}
                        className="text-center px-4 py-2 rounded-xl
                          bg-gray-50 dark:bg-white/[0.03]
                          border border-gray-100 dark:border-white/[0.06]">
                        <p className="text-lg font-extrabold font-mono text-gray-800 dark:text-white">
                          {s.icon} {s.value}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workload bar */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-gray-500 dark:text-slate-500">Weekly Workload</p>
                    <span className={`text-xs font-bold ${theoryCount + labCount >= limit ? "text-red-500" : "text-emerald-500"}`}>
                      {theoryCount + labCount >= limit ? "⚠ At limit" : "✓ Within limit"}
                    </span>
                  </div>
                  <WorkloadBar used={theoryCount + labCount} limit={limit} />
                </div>
              </div>

              {/* Timetable grid */}
              {loadingTT ? (
                <div className="flex items-center justify-center h-48 bg-white dark:bg-[#0f1626]
                  border border-gray-200 dark:border-white/[0.07] rounded-2xl gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin" />
                  <span className="text-sm text-gray-400">Loading timetable…</span>
                </div>
              ) : !timetable.length ? (
                <div className="flex items-center justify-center h-48 bg-white dark:bg-[#0f1626]
                  border border-dashed border-gray-200 dark:border-white/[0.07] rounded-2xl">
                  <div className="text-center">
                    <span className="text-3xl block mb-2">📭</span>
                    <p className="text-sm text-gray-400 dark:text-slate-500">No entries for this faculty</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">

                  {/* Slot time header legend */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-3
                    bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                    {TIME_LABELS.map((t, i) => (
                      <span key={i} className="text-[10px] font-mono text-gray-400 dark:text-slate-600">
                        <span className="font-bold text-gray-600 dark:text-slate-400">S{i+1}</span> {t}
                      </span>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm min-w-[900px]">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.07]">
                          <th className="p-3 text-left text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-600 w-28 shrink-0">
                            Day
                          </th>
                          {SLOTS.map((s) => (
                            <th key={s} className="p-3 text-center text-xs font-bold text-gray-500 dark:text-slate-500 min-w-[90px]">
                              <div className="font-extrabold text-gray-700 dark:text-slate-300">S{s}</div>
                              <div className="font-mono text-[10px] text-gray-400 dark:text-slate-600">{TIME_LABELS[s-1]}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DAYS.map((day, di) => (
                          <tr key={day} className="border-b border-gray-100 dark:border-white/[0.04] last:border-0">
                            <td className="p-3 font-bold text-xs text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-white/[0.02] border-r border-gray-100 dark:border-white/[0.05]">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20
                                  flex items-center justify-center text-[10px] font-extrabold text-blue-500 font-mono">
                                  D{di+1}
                                </div>
                                <span className="hidden lg:block">Day Order {di+1}</span>
                              </div>
                            </td>
                            {SLOTS.map((slot) => {
                              const entry = getEntry(day, slot);
                              if (!entry) return (
                                <td key={slot} className="p-2 text-center border-r border-gray-100 dark:border-white/[0.03] last:border-0">
                                  <span className="text-xs text-gray-300 dark:text-slate-700">—</span>
                                </td>
                              );
                              const isLab = entry.isLab;
                              return (
                                <td key={slot}
                                  className={`p-1.5 border-r border-gray-100 dark:border-white/[0.03] last:border-0 align-top
                                    ${isLab
                                      ? "bg-emerald-50 dark:bg-emerald-500/[0.07]"
                                      : "bg-blue-50/50 dark:bg-blue-500/[0.05]"
                                    }`}>
                                  <div className={`rounded-lg p-2 h-full border
                                    ${isLab
                                      ? "border-emerald-200 dark:border-emerald-500/20"
                                      : "border-blue-200/50 dark:border-blue-500/20"
                                    }`}>
                                    {/* Subject */}
                                    <p className={`text-xs font-extrabold leading-tight truncate
                                      ${isLab ? "text-emerald-700 dark:text-emerald-400" : "text-blue-700 dark:text-blue-400"}`}>
                                      {entry.subjectId?.name || "—"}
                                    </p>
                                    {/* Code */}
                                    <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                                      {entry.subjectId?.code}
                                    </p>
                                    {/* Section / Batch */}
                                    {(entry.sectionId || entry.batchId) && (
                                      <div className="mt-1.5 flex flex-wrap gap-1">
                                        {entry.sectionId?.name && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded
                                            bg-gray-100 dark:bg-white/[0.06]
                                            text-gray-500 dark:text-slate-500 border border-gray-200 dark:border-white/[0.08]">
                                            {entry.sectionId.name}
                                          </span>
                                        )}
                                        {entry.batchId?.name && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded
                                            bg-emerald-100 dark:bg-emerald-500/10
                                            text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                            {entry.batchId.name}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    {/* Lab / Theory tag */}
                                    <div className="mt-1">
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
                                        ${isLab
                                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                          : "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        }`}>
                                        {isLab ? "🔬 Lab" : "📖 Theory"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}