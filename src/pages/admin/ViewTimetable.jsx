import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import TimetableGrid from "../../components/timetable/TimetableGrid";
import axios from "../../api/axiosInstance";

const DAYS_LIST = ["Day Order 1","Day Order 2","Day Order 3","Day Order 4","Day Order 5"];

const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl
  bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
  text-gray-900 dark:text-gray-100
  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`;

const btnBase  = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150";
const activeBtn = "bg-blue-600 text-white shadow-sm shadow-blue-500/20";
const inactiveBtn = "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.1]";

// Group entries by teacher
function groupByTeacher(entries) {
  const map = new Map();
  for (const e of entries) {
    const tid  = e.teacherId?._id || e.teacherId;
    const name = e.teacherId?.name || "Unknown";
    if (!map.has(tid)) {
      map.set(tid, { teacher: e.teacherId, entries: [] });
    }
    map.get(tid).entries.push(e);
  }
  return Array.from(map.values());
}

export default function ViewTimetable() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [view,    setView]    = useState("list");   // "list" | "grid"
  const [search,  setSearch]  = useState("");
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(null);
  const [semFilter, setSemFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get("/admin/timetable");
      setData(r.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Filter by search + sem
  const filtered = data.filter((e) => {
    const q  = search.toLowerCase();
    const matchSearch =
      !search ||
      e.teacherId?.name?.toLowerCase().includes(q) ||
      e.subjectId?.name?.toLowerCase().includes(q) ||
      e.subjectId?.code?.toLowerCase().includes(q);
    const matchSem =
      semFilter === "all" || String(e.subjectId?.sem) === semFilter;
    return matchSearch && matchSem;
  });

  // Unique sems in data for filter tabs
  const sems = [...new Set(data.map((e) => e.subjectId?.sem).filter(Boolean))].sort((a,b)=>a-b);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`/admin/edit-timetable/${editing._id}`, {
        day:       editing.day,
        slot:      editing.slot,
        subjectId: editing.subjectId?._id || editing.subjectId,
        teacherId: editing.teacherId?._id || editing.teacherId,
      });
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const confirmDelete = async (id) => {
    if (!window.confirm("Delete this timetable entry?")) return;
    setDeleting(id);
    try {
      await axios.delete(`/admin/timetable/${id}`);
      setData((p) => p.filter((e) => e._id !== id));
    } finally { setDeleting(null); }
  };

  return (
    <AdminLayout title="Timetable Manager">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Timetable Manager
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            View, edit and delete timetable entries
          </p>
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`${btnBase} ${view==="list"?activeBtn:inactiveBtn}`}>☰ List</button>
          <button onClick={() => setView("grid")} className={`${btnBase} ${view==="grid"?activeBtn:inactiveBtn}`}>⊞ Grid</button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by faculty or subject…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl
              bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
              text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Sem filter */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setSemFilter("all")}
            className={`${btnBase} ${semFilter==="all"?activeBtn:inactiveBtn}`}>All</button>
          {sems.map((s) => (
            <button key={s} onClick={() => setSemFilter(String(s))}
              className={`${btnBase} ${semFilter===String(s)?activeBtn:inactiveBtn}`}>
              Sem {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <span className="text-xs font-mono text-gray-400 dark:text-slate-600">
          {filtered.length} entries · {groupByTeacher(filtered).length} faculty
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500/40" />
            <span className="text-xs text-gray-500 dark:text-slate-500">Lab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-violet-500/30 border border-violet-500/40" />
            <span className="text-xs text-gray-500 dark:text-slate-500">Theory</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-ring" />
          <p className="text-sm text-gray-400">Loading timetable…</p>
        </div>
      ) : !filtered.length ? (
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-12 text-center">
          <span className="text-5xl block mb-4 animate-float">🗓</span>
          <p className="text-base font-bold text-gray-700 dark:text-slate-300">No entries found</p>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
            {search ? "Try a different search" : "Generate the timetable first"}
          </p>
        </div>
      ) : (
        <div className={`grid gap-5 items-start ${editing ? "grid-cols-1 xl:grid-cols-[1fr_360px]" : "grid-cols-1"}`}>

          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] overflow-hidden overflow-x-auto animate-fade-up">
              <table className="w-full border-collapse" style={{ minWidth: 700 }}>
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.07]">
                    {["Faculty","Designation","Subject","Day","Slot","Sem","Type",""].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest
                        text-gray-400 dark:text-slate-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id}
                      className="border-b border-gray-100 dark:border-white/[0.04] last:border-0
                        hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600
                            flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {item.teacherId?.name?.[0] || "?"}
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 whitespace-nowrap">
                            {item.teacherId?.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                          bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 whitespace-nowrap">
                          {item.teacherId?.designation || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{item.subjectId?.name}</p>
                        <p className="text-xs font-mono text-gray-400 dark:text-slate-500 mt-0.5">{item.subjectId?.code}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 whitespace-nowrap">
                          {item.day?.replace("Day Order ", "DO ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-extrabold font-mono text-gray-700 dark:text-slate-300">S{item.slot}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold font-mono text-violet-600 dark:text-violet-400">
                          {item.subjectId?.sem ? `Sem ${item.subjectId.sem}` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                          ${item.isLab
                            ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"}`}>
                          {item.isLab ? "🔬 Lab" : "📖 Theory"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEditing({ ...item })}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold
                              bg-blue-500/10 text-blue-600 dark:text-blue-400
                              border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                            ✏️
                          </button>
                          <button
                            onClick={() => confirmDelete(item._id)}
                            disabled={deleting === item._id}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold
                              bg-rose-500/10 text-rose-600 dark:text-rose-400
                              border border-rose-500/20 hover:bg-rose-500/20 transition-colors
                              disabled:opacity-40">
                            {deleting === item._id ? "…" : "🗑"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── GRID VIEW ── */}
          {view === "grid" && (
            <div className="space-y-5 animate-fade-up">
              {groupByTeacher(filtered).map(({ teacher, entries }, gi) => (
                <div key={gi}
                  className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
                  {/* Faculty header */}
                  <div className="flex items-center justify-between px-5 py-3.5
                    bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600
                        flex items-center justify-center text-sm font-extrabold text-white">
                        {teacher?.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{teacher?.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{teacher?.designation}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full
                      bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {entries.length} slots
                    </span>
                  </div>

                  {/* Entries grid */}
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {entries.map((e) => (
                      <div key={e._id}
                        className={`relative rounded-xl p-3 border group
                          ${e.isLab
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20"
                          }`}>
                        <p className={`text-[11px] font-bold truncate
                          ${e.isLab ? "text-emerald-700 dark:text-emerald-400" : "text-violet-700 dark:text-violet-400"}`}>
                          {e.subjectId?.code || e.subjectId?.name?.slice(0,8)}
                        </p>
                        <p className="text-[10px] font-mono text-gray-500 dark:text-slate-500 mt-0.5">
                          {e.day?.replace("Day Order ", "DO ")} · S{e.slot}
                        </p>
                        {e.subjectId?.sem && (
                          <p className="text-[9px] font-bold text-gray-400 dark:text-slate-600 mt-0.5">
                            Sem {e.subjectId.sem}
                          </p>
                        )}

                        {/* Action buttons — show on hover */}
                        <div className="absolute top-1.5 right-1.5 hidden group-hover:flex gap-1">
                          <button onClick={() => setEditing({ ...e })}
                            className="w-5 h-5 rounded flex items-center justify-center text-[9px]
                              bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.1]
                              text-blue-600 dark:text-blue-400 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                            ✏️
                          </button>
                          <button onClick={() => confirmDelete(e._id)}
                            disabled={deleting === e._id}
                            className="w-5 h-5 rounded flex items-center justify-center text-[9px]
                              bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.1]
                              text-rose-600 dark:text-rose-400 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors
                              disabled:opacity-40">
                            🗑
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── EDIT PANEL ── */}
          {editing && (
            <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
              rounded-2xl p-5 animate-scale-in xl:sticky xl:top-20">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                <span className="text-sm font-bold text-gray-800 dark:text-slate-200">✏️ Edit Entry</span>
                <button onClick={() => setEditing(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs
                    text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-white/[0.06]
                    hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">✕</button>
              </div>

              {/* Faculty info — read only */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl
                bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600
                  flex items-center justify-center text-xs font-bold text-white">
                  {editing.teacherId?.name?.[0] || "?"}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{editing.teacherId?.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">{editing.teacherId?.designation}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Day</label>
                <select className={inputCls + " cursor-pointer appearance-none"} value={editing.day}
                  onChange={(e) => setEditing((p) => ({ ...p, day: e.target.value }))}>
                  {DAYS_LIST.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="mb-5">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Slot (1–10)</label>
                <input className={inputCls} type="number" min={1} max={10} value={editing.slot}
                  onChange={(e) => setEditing((p) => ({ ...p, slot: Number(e.target.value) }))} />
              </div>

              <div className="flex gap-2">
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white
                    bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-150 flex items-center justify-center gap-2">
                  {saving
                    ? <><div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />Saving…</>
                    : "💾 Save"}
                </button>
                <button onClick={() => setEditing(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold
                    bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-300
                    border border-gray-200 dark:border-white/[0.08]
                    hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}