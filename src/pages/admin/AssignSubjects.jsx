import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";

const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl
  bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
  text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`;

const roleInfo = {
  theory:    { label: "Theory Faculty",   icon: "📖", cls: "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400" },
  main:      { label: "Main Lab Faculty", icon: "🔬", cls: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  cofaculty: { label: "Co-Faculty (Lab)", icon: "👥", cls: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
};

export default function AssignSubjects() {
  const { teachers, subjects, fetchTeachers, fetchSubjects, assignSubject } = useAdminStore();
  const [form, setForm] = useState({ teacherId: "", subjectId: "", role: "theory" });
  const [ok,   setOk]   = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => { fetchTeachers(); fetchSubjects(); }, []);

  const submit = async () => {
    if (!form.teacherId || !form.subjectId) return;
    await assignSubject(form);
    setForm({ teacherId: "", subjectId: "", role: "theory" });
    setOk(true); setTimeout(() => setOk(false), 3000);
  };

  return (
    <AdminLayout title="Assign Subjects">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Assign Subjects</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Link teachers to their subjects and define roles</p>
        </div>
      </div>

      <div className="max-w-lg">
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-base">🔗</div>
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Assign Subject to Teacher</span>
          </div>

          {ok && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl
              bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25
              text-emerald-700 dark:text-emerald-400 text-sm animate-scale-in">
              ✅ Subject assigned successfully!
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Select Teacher</label>
            <select className={inputCls + " cursor-pointer appearance-none"} value={form.teacherId} onChange={set("teacherId")}>
              <option value="">— Choose teacher —</option>
              {(teachers || []).map((t) => <option key={t._id} value={t._id}>{t.name} · {t.designation}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Select Subject</label>
            <select className={inputCls + " cursor-pointer appearance-none"} value={form.subjectId} onChange={set("subjectId")}>
              <option value="">— Choose subject —</option>
              {(subjects || []).map((s) => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Role</label>
            <select className={inputCls + " cursor-pointer appearance-none"} value={form.role} onChange={set("role")}>
              {Object.entries(roleInfo).map(([v, r]) => (
                <option key={v} value={v}>{r.icon} {r.label}</option>
              ))}
            </select>
          </div>

          {/* Role legend */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(roleInfo).map(([v, r]) => (
              <span key={v} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${r.cls}`}>
                {r.icon} {r.label}
              </span>
            ))}
          </div>

          <button onClick={submit}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white
              bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]
              shadow-md shadow-emerald-500/20 transition-all duration-150">
            🔗 Assign Subject
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}