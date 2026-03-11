import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";
import axios from "../../api/axiosInstance";

export default function ApproveWillingness() {
  const { approveWillingness } = useAdminStore();
  const [willingnessData, setWillingnessData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWillingness = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/willingness");
      setWillingnessData(res.data);
    } catch (e) {
      console.error("Failed to load willingness", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWillingness(); }, []);

  const handleApprove = async (teacherId) => {
    await approveWillingness(teacherId);
    await loadWillingness();
  };

  // Flatten all subjects from semesters array
  const getSubjects = (item) => {
    if (item.semesters?.length) {
      return item.semesters.flatMap((s) => s.subjects || []);
    }
    return item.subjects || [];
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">✋ Admin</p>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Approve Willingness Forms
        </h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
          Review and approve faculty willingness submissions
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin" />
          <span className="text-sm text-gray-400">Loading…</span>
        </div>
      ) : !willingnessData.length ? (
        <div className="flex items-center justify-center h-40
          bg-white dark:bg-[#0f1626] border border-dashed border-gray-200 dark:border-white/[0.07] rounded-2xl">
          <div className="text-center">
            <span className="text-3xl block mb-2">📭</span>
            <p className="text-sm text-gray-400 dark:text-slate-500">No willingness forms submitted yet</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {willingnessData.map((item) => {
            const subjects = getSubjects(item);
            const isPending  = item.status === "pending";
            const isApproved = item.status === "approved";

            return (
              <div key={item._id}
                className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">

                  {/* Teacher info */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20
                      flex items-center justify-center text-lg font-extrabold text-blue-500">
                      {item.teacherId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-gray-900 dark:text-white">
                        {item.teacherId?.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {item.teacherId?.designation}
                      </p>
                    </div>
                    <span className={`ml-2 text-xs font-bold px-2.5 py-1 rounded-full border capitalize
                      ${isApproved
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Approve button */}
                  {isPending && (
                    <button
                      onClick={() => handleApprove(item.teacherId._id)}
                      className="px-5 py-2 rounded-xl text-sm font-bold text-white
                        bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]
                        shadow-md shadow-emerald-500/20 transition-all">
                      ✓ Approve
                    </button>
                  )}
                </div>

                {/* Semesters + subjects */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-3">
                    Willing to Teach
                  </p>

                  {item.semesters?.length > 0 ? (
                    <div className="space-y-3">
                      {item.semesters.map((semEntry, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 dark:border-white/[0.07] overflow-hidden">
                          {/* Sem header */}
                          <div className="flex items-center gap-2 px-4 py-2
                            bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.06]">
                            <span className="text-xs font-extrabold font-mono text-blue-600 dark:text-blue-400">
                              SEM {semEntry.sem}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-slate-600">
                              {semEntry.program?.toUpperCase()}
                            </span>
                          </div>
                          {/* Subjects */}
                          <div className="flex flex-wrap gap-2 p-3">
                            {(semEntry.subjects || []).length === 0 ? (
                              <p className="text-xs text-gray-400 dark:text-slate-500 italic">No subjects selected</p>
                            ) : (
                              (semEntry.subjects || []).map((sub) => (
                                <span key={sub._id || sub}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border
                                    ${sub.isLab
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                      : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                                    }`}>
                                  {sub.isLab ? "🔬 " : "📖 "}
                                  {sub.name || sub}
                                  {sub.code && <span className="ml-1 font-mono text-[10px] opacity-70">{sub.code}</span>}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Fallback for old flat subjects format
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((sub) => (
                        <span key={sub._id || sub}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg border
                            bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
                          {sub.name || sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}