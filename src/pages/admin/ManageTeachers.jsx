import { useState, useEffect } from "react";
import  AdminLayout  from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";

const DESIG_STYLE = {
  "Professor":           { bg: "bg-amber-100 dark:bg-amber-500/10",  text: "text-amber-700 dark:text-amber-400"  },
  "Associate Professor": { bg: "bg-violet-100 dark:bg-violet-500/10",text: "text-violet-700 dark:text-violet-400" },
  "Assistant Professor": { bg: "bg-blue-100 dark:bg-blue-500/10",    text: "text-blue-700 dark:text-blue-400"    },
};

export default function ManageTeachers() {
  const { teachers, fetchTeachers, createTeacher } = useAdminStore();
  const [form, setForm] = useState({ name: "", email: "", designation: "Assistant Professor", priority: 1 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [search, setSearch]   = useState("");

  useEffect(() => { fetchTeachers(); }, []);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    await createTeacher(form);
    setForm({ name: "", email: "", designation: "Assistant Professor", priority: 1 });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const filtered = (teachers || []).filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Teachers">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Manage Teachers
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            Add faculty members and manage their profiles
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold
          bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400
          border border-amber-200 dark:border-amber-500/20">
          👥 {teachers?.length || 0} Teachers
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">

        {/* ── Add form ── */}
        <div className="bg-white dark:bg-[#0f1626]
          border border-gray-200 dark:border-white/[0.07]
          rounded-2xl p-6 animate-fade-up delay-1">

          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20
              flex items-center justify-center text-base">👤</div>
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Add New Teacher</span>
          </div>

          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl
              bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25
              text-emerald-700 dark:text-emerald-400 text-sm animate-scale-in">
              ✅ Teacher added successfully!
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
              text-gray-400 dark:text-slate-500">Full Name</label>
            <input value={form.name} onChange={set("name")} placeholder="Dr. John Smith"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl
                bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
              text-gray-400 dark:text-slate-500">Email</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="john@college.edu"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl
                bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>

          {/* Designation */}
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
              text-gray-400 dark:text-slate-500">Designation</label>
            <select value={form.designation} onChange={set("designation")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl cursor-pointer appearance-none
                bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
            </select>
          </div>

          {/* Priority */}
          <div className="mb-5">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
              text-gray-400 dark:text-slate-500">Priority (1 = Highest)</label>
            <input type="number" min={1} max={10} value={form.priority} onChange={set("priority")}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl
                bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>

          <button onClick={submit} disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white
              bg-amber-500 hover:bg-amber-400 active:scale-[0.98]
              shadow-md shadow-amber-500/20
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              transition-all duration-150 flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />Adding…</>
            ) : "➕ Add Teacher"}
          </button>
        </div>

        {/* ── Teacher list ── */}
        <div className="animate-fade-up delay-2">
          {/* Search */}
          <div className="relative mb-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl
                bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
                text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {!filtered.length ? (
            <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
              rounded-2xl p-8 text-center">
              <span className="text-4xl block mb-3 animate-float">👥</span>
              <p className="text-sm font-bold text-gray-700 dark:text-slate-300">No teachers found</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {search ? "Try a different search" : "Add your first teacher using the form"}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] overflow-hidden">
              {/* Table head */}
              <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-0
                bg-gray-50 dark:bg-white/[0.03]
                border-b border-gray-200 dark:border-white/[0.07]
                px-4 py-2.5">
                {["#", "Name", "Email", "Designation", "P"].map((h) => (
                  <p key={h} className="text-[10px] font-bold uppercase tracking-widest
                    text-gray-400 dark:text-slate-600 px-2">{h}</p>
                ))}
              </div>
              {/* Rows */}
              {filtered.map((t, i) => {
                const ds = DESIG_STYLE[t.designation] || DESIG_STYLE["Assistant Professor"];
                return (
                  <div key={t._id}
                    className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-0 items-center
                      px-4 py-3 border-b border-gray-100 dark:border-white/[0.04] last:border-0
                      hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    {/* # */}
                    <div className="px-2">
                      <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/[0.06]
                        flex items-center justify-center text-[10px] font-bold
                        text-gray-500 dark:text-slate-500 font-mono">
                        {i + 1}
                      </span>
                    </div>
                    {/* Name */}
                    <div className="px-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{t.name}</p>
                    </div>
                    {/* Email */}
                    <div className="px-2">
                      <p className="text-xs font-mono text-gray-500 dark:text-slate-500 truncate">{t.email}</p>
                    </div>
                    {/* Designation badge */}
                    <div className="px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                        whitespace-nowrap ${ds.bg} ${ds.text}`}>
                        {t.designation}
                      </span>
                    </div>
                    {/* Priority */}
                    <div className="px-2">
                      <span className="text-sm font-extrabold font-mono text-amber-500 dark:text-amber-400">
                        P{t.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}