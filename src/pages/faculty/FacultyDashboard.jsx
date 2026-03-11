import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacultyLayout from "../../components/layout/FacultyLayout";
import { useFacultyStore } from "../../store/facultyStore";
import { useAuthStore } from "../../store/authStore";

// Defined locally — SlotSelector does NOT export TIME_SLOTS
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

const QUICK = [
  { to: "/faculty/subjects",    icon: "📖", label: "My Subjects",     desc: "View assigned subjects",  color: "blue"   },
  { to: "/faculty/willingness", icon: "📋", label: "Willingness Form", desc: "Set your availability",   color: "amber"  },
  { to: "/faculty/timetable",   icon: "🗓", label: "My Timetable",    desc: "View your schedule",      color: "violet" },
];

const colorMap = {
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   stat: "text-blue-500 dark:text-blue-400"    },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  stat: "text-amber-500 dark:text-amber-400"  },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", stat: "text-violet-500 dark:text-violet-400"},
  green:  { bg: "bg-emerald-500/10",border: "border-emerald-500/20",stat: "text-emerald-500 dark:text-emerald-400"},
};

export default function FacultyDashboard() {
  const { assignedSubjects, timetable, fetchAssignedSubjects, fetchFacultyTimetable } = useFacultyStore();
  const user = useAuthStore((s) => s.user);
  const [time,    setTime]    = useState(new Date());
  const [todayDO, setTodayDO] = useState(1);

  useEffect(() => {
    fetchAssignedSubjects();
    fetchFacultyTimetable();
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hr         = time.getHours();
  const greeting   = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const todayKey   = `Day Order ${todayDO}`;
  const todaySlots = (timetable || []).filter((e) => e.day === todayKey).sort((a, b) => a.slot - b.slot);

  const stats = [
    { icon: "📖", label: "My Subjects",  value: assignedSubjects?.length ?? 0,                   color: "blue"   },
    { icon: "🗓", label: "Classes Today", value: todaySlots.length,                               color: "violet" },
    { icon: "🔬", label: "Lab Sessions",  value: (timetable||[]).filter((e) => e.isLab).length,   color: "green"  },
    { icon: "📅", label: "Total Slots",   value: (timetable||[]).length,                          color: "amber"  },
  ];

  return (
    <FacultyLayout title="Dashboard">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl mb-6
        bg-gradient-to-br from-blue-500/10 via-violet-500/5 to-transparent
        border border-blue-500/20 p-6 animate-fade-up">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full
          bg-blue-500 blur-3xl opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">👤 Faculty Portal</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {greeting}, {user?.name?.split(" ").pop() || "Faculty"} 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Here's your overview for today.</p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
              rounded-2xl px-5 py-2.5 text-center">
              <p className="text-xl font-extrabold font-mono text-blue-500 leading-none">
                {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </p>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((d) => (
                <button key={d} onClick={() => setTodayDO(d)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all
                    ${todayDO === d
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-white/[0.05] text-gray-500 dark:text-slate-500 border border-gray-200 dark:border-white/[0.08] hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    }`}>
                  D{d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <div key={s.label}
              className="flex items-center gap-3 p-4 bg-white dark:bg-[#0f1626]
                border border-gray-200 dark:border-white/[0.07] rounded-2xl
                hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${c.bg} ${c.border}`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-xl font-extrabold font-mono leading-none ${c.stat}`}>{s.value}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Today's schedule ── */}
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
          rounded-2xl p-5 animate-fade-up delay-3">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Day Order {todayDO} Schedule</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold
              bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {todaySlots.length} classes
            </span>
          </div>

          {!todaySlots.length ? (
            <div className="py-10 text-center">
              <span className="text-4xl block mb-3 animate-float">🎉</span>
              <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Free Day!</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">No classes on DO {todayDO}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySlots.map((e) => {
                const ts = TIME_SLOTS.find((t) => t.s === e.slot);
                return (
                  <div key={e._id || e.slot}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all
                      ${e.isLab
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                        : "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20"
                      }`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center
                      text-xs font-extrabold font-mono
                      ${e.isLab
                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400"
                      }`}>
                      S{e.slot}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                        {e.subjectId?.name || e.subjectName || "Subject"}
                      </p>
                      {ts && (
                        <p className="text-xs font-mono text-gray-400 dark:text-slate-500 mt-0.5">
                          {ts.f} – {ts.t}
                        </p>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                      ${e.isLab
                        ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400"
                      }`}>
                      {e.isLab ? "Lab" : "Theory"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick nav ── */}
        <div className="animate-fade-up delay-4">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600">Quick Navigation</p>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.06]" />
          </div>

          <div className="space-y-3">
            {QUICK.map((q, i) => {
              const c = colorMap[q.color];
              return (
                <Link key={q.to} to={q.to} className="no-underline block">
                  <div className="flex items-center gap-4 p-4 rounded-2xl
                    bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
                    hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-up"
                    style={{ animationDelay: `${(i + 5) * 60}ms` }}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${c.bg} ${c.border}`}>
                      {q.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{q.label}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{q.desc}</p>
                    </div>
                    <span className="text-gray-300 dark:text-slate-600">›</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {assignedSubjects?.length > 0 && (
            <div className="mt-3 bg-white dark:bg-[#0f1626]
              border border-gray-200 dark:border-white/[0.07] rounded-2xl p-4 animate-fade-up delay-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-3">
                My Subjects
              </p>
              <div className="flex flex-wrap gap-2">
                {assignedSubjects.slice(0, 5).map((s) => (
                  <span key={s._id}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium
                      bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400
                      border border-gray-200 dark:border-white/[0.08]">
                    {s.isLab ? "🔬" : "📖"} {s.name}
                  </span>
                ))}
                {assignedSubjects.length > 5 && (
                  <span className="px-2.5 py-1 rounded-lg text-xs text-gray-400 dark:text-slate-600
                    bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
                    +{assignedSubjects.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </FacultyLayout>
  );
}