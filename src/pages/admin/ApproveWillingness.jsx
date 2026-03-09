import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";
import axios from "../../api/axiosInstance";

export default function ApproveWillingness() {
  const { approveWillingness } = useAdminStore();
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await axios.get("/admin/willingness"); setData(r.data); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (teacherId) => {
    await approveWillingness(teacherId);
    load();
  };

  return (
    <AdminLayout title="Willingness">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Approve Willingness</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Review and approve faculty availability forms</p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold
          bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400
          border border-amber-200 dark:border-amber-500/20">
          ✋ {data.length} Submissions
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-ring" />
          <p className="text-sm text-gray-400">Loading submissions…</p>
        </div>
      ) : !data.length ? (
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-12 text-center">
          <span className="text-5xl block mb-4 animate-float">✋</span>
          <p className="text-base font-bold text-gray-700 dark:text-slate-300">No submissions yet</p>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Faculty haven't submitted willingness forms</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((item, i) => (
            <div key={item._id}
              className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}>

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white
                    bg-gradient-to-br from-blue-500 to-violet-600">
                    {item.teacherId?.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{item.teacherId?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{item.subjects?.length} subject(s) selected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                    ${item.status === "approved"
                      ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
                    {item.status === "approved" ? "✅ Approved" : "⏳ Pending"}
                  </span>
                  {item.status !== "approved" && (
                    <button onClick={() => approve(item.teacherId._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white
                        bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all">
                      Approve
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.subjects?.map((s) => (
                  <span key={s._id}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium
                      bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400
                      border border-gray-200 dark:border-white/[0.08]">
                    {s.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(item.availability || {}).map(([day, slots]) => (
                  <div key={day} className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/[0.05]">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-2">
                      {day.replace("Day Order ", "DO ")}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {slots?.length ? slots.map((s) => (
                        <span key={s} className="w-5 h-5 rounded-md flex items-center justify-center
                          text-[9px] font-bold font-mono
                          bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">{s}</span>
                      )) : <span className="text-[10px] text-gray-400 dark:text-slate-600">None</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}