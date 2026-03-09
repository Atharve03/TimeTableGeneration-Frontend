import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";

const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl
  bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
  text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`;

const labelCls = "block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500";

const PROGRAM_SEMS = { btech: 8, mtech: 4 };

export default function ManageSubjects() {
  const { subjects, fetchSubjects, createSubject } = useAdminStore();
  const [form, setForm] = useState({
    name:           "",
    code:           "",
    type:           "theory",
    weeklyLectures: 3,
    program:        "btech",
    sem:            1,
  });
  const [ok,     setOk]     = useState(false);
  const [filter, setFilter] = useState({ program: "all", sem: "all" });

  useEffect(() => { fetchSubjects(); }, []);

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm((p) => {
      const next = { ...p, [k]: val };
      // When program changes reset sem to 1
      if (k === "program") next.sem = 1;
      return next;
    });
  };

  const submit = async () => {
    if (!form.name || !form.code) return;
    await createSubject({
      name:           form.name,
      code:           form.code,
      isLab:          form.type === "lab",
      weeklyLectures: Number(form.weeklyLectures),
      program:        form.program,
      sem:            Number(form.sem),
    });
    setForm({ name:"", code:"", type:"theory", weeklyLectures:3, program:"btech", sem:1 });
    setOk(true); setTimeout(() => setOk(false), 3000);
  };

  // Filtered subject list
  const shown = (subjects || []).filter((s) => {
    const mp = filter.program === "all" || s.program === filter.program;
    const ms = filter.sem === "all"     || String(s.sem) === filter.sem;
    return mp && ms;
  });

  const maxSems = PROGRAM_SEMS[form.program] || 8;

  const btnBase   = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150";
  const activeBtn = "bg-blue-600 text-white shadow-sm";
  const inactiveBtn = "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.1]";

  return (
    <AdminLayout title="Manage Subjects">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Manage Subjects
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            Create subjects with program and semester assignment
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold
          bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400
          border border-violet-200 dark:border-violet-500/20">
          📚 {subjects?.length || 0} Subjects
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">

        {/* ── Add form ── */}
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
          rounded-2xl p-6 animate-fade-up delay-1">

          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-base">📚</div>
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Add Subject</span>
          </div>

          {ok && (
            <div className="flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl
              bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25
              text-emerald-700 dark:text-emerald-400 text-sm animate-scale-in">
              ✅ Subject added!
            </div>
          )}

          <div className="mb-4"><label className={labelCls}>Subject Name</label>
            <input className={inputCls} placeholder="Data Structures" value={form.name} onChange={set("name")} />
          </div>

          <div className="mb-4"><label className={labelCls}>Subject Code</label>
            <input className={inputCls} placeholder="CS301" value={form.code} onChange={set("code")} />
          </div>

          {/* Program — NEW */}
          <div className="mb-4">
            <label className={labelCls}>Program</label>
            <div className="grid grid-cols-2 gap-2">
              {["btech","mtech"].map((p) => (
                <button key={p} onClick={() => setForm((f) => ({ ...f, program: p, sem: 1 }))}
                  className={`py-2 rounded-xl text-sm font-bold border-2 transition-all
                    ${form.program === p
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-slate-400 hover:border-gray-300"
                    }`}>
                  {p === "btech" ? "🎓 B.Tech" : "🔬 M.Tech"}
                </button>
              ))}
            </div>
          </div>

          {/* Semester — NEW */}
          <div className="mb-4">
            <label className={labelCls}>Semester</label>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: maxSems }, (_, i) => i + 1).map((s) => (
                <button key={s}
                  onClick={() => setForm((f) => ({ ...f, sem: s }))}
                  className={`py-2 rounded-lg text-sm font-bold font-mono border-2 transition-all
                    ${form.sem === s
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                      : "border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] text-gray-500 dark:text-slate-500 hover:border-gray-300"
                    }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={labelCls}>Type</label>
            <select className={inputCls + " cursor-pointer appearance-none"} value={form.type} onChange={set("type")}>
              <option value="theory">📖 Theory</option>
              <option value="lab">🔬 Lab</option>
            </select>
          </div>

          <div className="mb-5">
            <label className={labelCls}>Weekly Lectures</label>
            <input className={inputCls} type="number" min={1} max={10}
              value={form.weeklyLectures} onChange={set("weeklyLectures")} />
          </div>

          <button onClick={submit}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white
              bg-violet-600 hover:bg-violet-500 active:scale-[0.98]
              shadow-md shadow-violet-500/20 transition-all duration-150">
            ➕ Add Subject
          </button>
        </div>

        {/* ── Subject list ── */}
        <div className="animate-fade-up delay-2">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Program filter */}
            {["all","btech","mtech"].map((p) => (
              <button key={p}
                onClick={() => setFilter((f) => ({ ...f, program: p, sem: "all" }))}
                className={`${btnBase} ${filter.program===p ? activeBtn : inactiveBtn}`}>
                {p === "all" ? "All" : p === "btech" ? "🎓 B.Tech" : "🔬 M.Tech"}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-200 dark:bg-white/[0.08] self-center mx-1" />
            {/* Sem filter — only show if program selected */}
            {filter.program !== "all" && (
              <>
                <button
                  onClick={() => setFilter((f) => ({ ...f, sem: "all" }))}
                  className={`${btnBase} ${filter.sem==="all" ? activeBtn : inactiveBtn}`}>
                  All Sem
                </button>
                {Array.from({ length: PROGRAM_SEMS[filter.program] || 8 }, (_, i) => i + 1).map((s) => (
                  <button key={s}
                    onClick={() => setFilter((f) => ({ ...f, sem: String(s) }))}
                    className={`${btnBase} ${filter.sem===String(s) ? activeBtn : inactiveBtn}`}>
                    Sem {s}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] overflow-hidden">
            <div className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.07]
              grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] px-4 py-2.5 gap-3">
              {["#","Name","Code","Program","Sem","Type","×/wk"].map((h) => (
                <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600">{h}</p>
              ))}
            </div>

            {!shown.length ? (
              <div className="p-10 text-center">
                <span className="text-4xl block mb-3 animate-float">📚</span>
                <p className="text-sm font-bold text-gray-700 dark:text-slate-300">No subjects found</p>
              </div>
            ) : shown.map((s, i) => (
              <div key={s._id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-3 px-4 py-3
                  border-b border-gray-100 dark:border-white/[0.04] last:border-0
                  hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <span className="text-xs font-mono text-gray-400 dark:text-slate-600 w-5">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{s.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono
                  bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">{s.code}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                  ${s.program === "btech"
                    ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"}`}>
                  {s.program?.toUpperCase()}
                </span>
                <span className="text-xs font-extrabold font-mono text-gray-600 dark:text-slate-400">
                  S{s.sem}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                  ${s.isLab
                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"}`}>
                  {s.isLab ? "🔬" : "📖"}
                </span>
                <span className="text-sm font-extrabold font-mono text-amber-500 dark:text-amber-400">{s.weeklyLectures}×</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}