import { useEffect } from "react";
import FacultyLayout from "../../components/layout/FacultyLayout";
import { useFacultyStore } from "../../store/facultyStore";

const roleStyle = {
  theory:    { bg: "bg-violet-500/10",  border: "border-violet-500/20",  text: "text-violet-700 dark:text-violet-400",  icon: "📖" },
  main:      { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400", icon: "🔬" },
  cofaculty: { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-700 dark:text-blue-400",       icon: "👥" },
};

export default function MySubjects() {
  const { assignedSubjects, fetchAssignedSubjects, loading } = useFacultyStore();
  useEffect(() => { fetchAssignedSubjects(); }, []);

  return (
    <FacultyLayout title="My Subjects">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Subjects</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Your assigned subjects this semester</p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold
          bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400
          border border-blue-200 dark:border-blue-500/20">
          📚 {assignedSubjects?.length || 0} Assigned
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-ring" />
          <p className="text-sm text-gray-400">Loading subjects…</p>
        </div>
      ) : !assignedSubjects?.length ? (
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-12 text-center">
          <span className="text-5xl block mb-4 animate-float">📚</span>
          <p className="text-base font-bold text-gray-700 dark:text-slate-300">No subjects assigned</p>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Contact your admin to get subjects assigned</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedSubjects.map((sub, i) => {
            const rs = roleStyle[sub.role] || roleStyle.theory;
            return (
              <div key={sub._id}
                className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
                  rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg
                  transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${rs.bg} ${rs.border}`}>
                    {rs.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200 leading-tight">{sub.name}</p>
                    <p className="text-xs font-mono text-gray-400 dark:text-slate-500 mt-0.5">{sub.code}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rs.bg} ${rs.border} ${rs.text}`}>
                    {rs.icon} {sub.role}
                  </span>
                  {sub.isLab && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                      bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      🔬 Lab
                    </span>
                  )}
                  {sub.weeklyLectures && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono
                      bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      {sub.weeklyLectures}×/week
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FacultyLayout>
  );
}