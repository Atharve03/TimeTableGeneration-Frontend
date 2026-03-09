import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "../../api/axiosInstance";

const DAYS_LIST = ["Day Order 1","Day Order 2","Day Order 3","Day Order 4","Day Order 5"];

const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl
  bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
  text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`;

export default function EditTimetable() {
  const [data,    setData]    = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [search,  setSearch]  = useState("");

  const load = async () => {
    setLoading(true);
    try { const r = await axios.get("/timetable/department"); setData(r.data); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    await axios.put(`/admin/edit-timetable/${editing._id}`, editing);
    setSaving(false); setEditing(null); load();
  };

  const shown = data.filter((e) =>
    !search ||
    e.subjectId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.teacherId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Edit Timetable">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Edit Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Manually adjust timetable entries</p>
        </div>
        <div className="relative w-full sm:w-56">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl
              bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
              text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-600
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-ring" />
        </div>
      ) : (
        <div className={`grid gap-5 items-start ${editing ? "grid-cols-1 xl:grid-cols-[1fr_360px]" : "grid-cols-1"}`}>

          {/* Table */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/[0.07] overflow-hidden animate-fade-up overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 600 }}>
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.07]">
                  {["Day","Slot","Subject","Teacher","Type",""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest
                      text-gray-400 dark:text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => (
                  <tr key={item._id}
                    className="border-b border-gray-100 dark:border-white/[0.04] last:border-0
                      hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400">
                        {item.day?.replace("Day Order ", "DO ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-extrabold font-mono text-gray-700 dark:text-slate-300">S{item.slot}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{item.subjectId?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-slate-400">{item.teacherId?.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                        ${item.isLab
                          ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"}`}>
                        {item.isLab ? "Lab" : "Theory"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setEditing({ ...item })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold
                          bg-blue-500/10 text-blue-600 dark:text-blue-400
                          border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit panel */}
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
              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Day</label>
                <select className={inputCls + " cursor-pointer appearance-none"} value={editing.day}
                  onChange={(e) => setEditing((p) => ({ ...p, day: e.target.value }))}>
                  {DAYS_LIST.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Slot (1–10)</label>
                <input className={inputCls} type="number" min={1} max={10} value={editing.slot}
                  onChange={(e) => setEditing((p) => ({ ...p, slot: e.target.value }))} />
              </div>
              <div className="mb-4">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Subject ID</label>
                <input className={inputCls} value={editing.subjectId?._id || editing.subjectId || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, subjectId: e.target.value }))} />
              </div>
              <div className="mb-5">
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Teacher ID</label>
                <input className={inputCls} value={editing.teacherId?._id || editing.teacherId || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, teacherId: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white
                    bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-150 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />Saving…</> : "💾 Save"}
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