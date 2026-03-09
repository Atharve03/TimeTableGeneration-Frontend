import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";

const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl
  bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
  text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`;

export default function SetSemester() {
  const { setSemester } = useAdminStore();
  const [form, setForm] = useState({ name: "", year: "", semester: "odd", department: "CSE" });
  const [ok,   setOk]   = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.year) return;
    await setSemester(form);
    setForm({ name: "", year: "", semester: "odd", department: "CSE" });
    setOk(true); setTimeout(() => setOk(false), 3000);
  };

  return (
    <AdminLayout title="Set Semester">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Set Semester / Section</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Create academic sections for timetable generation</p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-6 animate-scale-in">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-base">🗓</div>
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Create Section</span>
          </div>

          {ok && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl
              bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25
              text-emerald-700 dark:text-emerald-400 text-sm animate-scale-in">
              ✅ Section created successfully!
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Section Name</label>
            <input className={inputCls} placeholder="e.g. A-1, B-2" value={form.name} onChange={set("name")} />
          </div>
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Academic Year</label>
            <input className={inputCls} placeholder="2025" value={form.year} onChange={set("year")} />
          </div>
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Semester</label>
            <select className={inputCls + " cursor-pointer appearance-none"} value={form.semester} onChange={set("semester")}>
              <option value="odd">Odd Semester</option>
              <option value="even">Even Semester</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Department</label>
            <select className={inputCls + " cursor-pointer appearance-none"} value={form.department} onChange={set("department")}>
              {["CSE","ECE","IT","EEE","MECH","CIVIL"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <button onClick={submit}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white
              bg-amber-500 hover:bg-amber-400 active:scale-[0.98]
              shadow-md shadow-amber-500/20 transition-all duration-150">
            🗓 Create Section
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}