import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";
import { useAuthStore } from "../../store/authStore";

const QUICK_ACTIONS = [
  { to: "/admin/teachers",           icon: "👤", label: "Add Teacher",      color: "blue"   },
  { to: "/admin/subjects",           icon: "📚", label: "Add Subject",      color: "violet" },
  { to: "/admin/assign-subject",     icon: "🔗", label: "Assign Subject",   color: "green"  },
  { to: "/admin/semester",           icon: "🗓", label: "Set Semester",     color: "amber"  },
  { to: "/admin/willingness",        icon: "✋", label: "Willingness",      color: "rose"   },
  { to: "/admin/timetable/generate", icon: "⚡", label: "Generate TT",     color: "amber"  },
];

const colorMap = {
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   text: "text-blue-500 dark:text-blue-400"   },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-500 dark:text-violet-400" },
  green:  { bg: "bg-emerald-500/10",border: "border-emerald-500/20",text: "text-emerald-500 dark:text-emerald-400" },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-500 dark:text-amber-400"  },
  rose:   { bg: "bg-rose-500/10",   border: "border-rose-500/20",   text: "text-rose-500 dark:text-rose-400"   },
};

export default function AdminDashboard() {
  const { teachers, subjects, fetchTeachers, fetchSubjects } = useAdminStore();
  const user = useAuthStore((s) => s.user);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hr = time.getHours();
  const greeting = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { icon: "👥", label: "Total Teachers",  value: teachers?.length ?? 0, color: "blue"   },
    { icon: "📚", label: "Subjects",         value: subjects?.length ?? 0, color: "violet" },
    { icon: "🗓", label: "Sections",         value: 0,                     color: "amber"  },
    { icon: "📅", label: "Timetable Slots",  value: 0,                     color: "green"  },
  ];

  return (
    <AdminLayout title="Dashboard">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl mb-6
        bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent
        border border-amber-500/20 p-6 animate-fade-up">

        {/* Glow blob */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full
          bg-amber-400 blur-3xl opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
              ⚙️ Admin Control Center
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {greeting}, {user?.name?.split(" ")[0] || "Admin"} 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
              Manage teachers, subjects, and generate timetables.
            </p>
          </div>

          {/* Live clock */}
          <div className="bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
            rounded-2xl px-5 py-3 text-center shrink-0">
            <p className="text-2xl font-extrabold font-mono text-amber-500 leading-none">
              {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
              {time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <div key={s.label}
              className="flex items-center gap-3 p-4
                bg-white dark:bg-[#0f1626]
                border border-gray-200 dark:border-white/[0.07]
                rounded-2xl hover:-translate-y-0.5 hover:shadow-lg
                transition-all duration-200 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${c.bg} ${c.border}`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-xl font-extrabold font-mono leading-none ${c.text}`}>{s.value}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick actions ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600">
            Quick Actions
          </p>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((q, i) => {
            const c = colorMap[q.color];
            return (
              <Link key={q.to} to={q.to} className="no-underline">
                <div className="flex flex-col items-center gap-2.5 p-4 rounded-2xl
                  bg-white dark:bg-[#0f1626]
                  border border-gray-200 dark:border-white/[0.07]
                  hover:-translate-y-1 hover:shadow-lg
                  transition-all duration-200 cursor-pointer text-center
                  animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl border ${c.bg} ${c.border}`}>
                    {q.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 leading-tight">
                    {q.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Bottom 2-col ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Workflow guide */}
        <div className="bg-white dark:bg-[#0f1626]
          border border-gray-200 dark:border-white/[0.07]
          rounded-2xl p-5 animate-fade-up delay-3">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
            <span className="text-lg">📋</span>
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Setup Workflow</span>
          </div>
          <div className="space-y-2">
            {[
              "Add teachers & subjects",
              "Assign subjects to teachers",
              "Set semester / create section",
              "Faculty submit willingness",
              "Approve willingness forms",
              "Generate timetable ⚡",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl
                bg-gray-50 dark:bg-white/[0.03] text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20
                  flex items-center justify-center text-[10px] font-bold text-blue-500 shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-600 dark:text-slate-400 text-xs">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="bg-white dark:bg-[#0f1626]
          border border-gray-200 dark:border-white/[0.07]
          rounded-2xl p-5 animate-fade-up delay-4">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">System Status</span>
          </div>
          <div className="space-y-1">
            {[
              { label: "Backend API",       status: "Online",    ok: true  },
              { label: "Database",          status: "Connected", ok: true  },
              { label: "Timetable Engine",  status: "Ready",     ok: true  },
              { label: "Conflict Checker",  status: "Active",    ok: true  },
            ].map((row) => (
              <div key={row.label}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl
                  hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                <span className="text-xs text-gray-600 dark:text-slate-400">{row.label}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full
                  ${row.ok
                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}