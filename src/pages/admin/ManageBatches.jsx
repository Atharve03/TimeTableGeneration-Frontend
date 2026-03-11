import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "../../api/axiosInstance";

export default function ManageBatches() {
  const [batches,   setBatches]   = useState([]);
  const [sections,  setSections]  = useState([]);
  const [name,      setName]      = useState("");
  const [sectionId, setSectionId] = useState("");
  const [strength,  setStrength]  = useState(20);
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState("");

  const load = async () => {
    const [b, s] = await Promise.all([
      axios.get("/admin/batches"),
      axios.get("/admin/teachers").then(() => axios.get("/admin/set-semester")).catch(() => ({ data: [] })),
    ]);
    setBatches(b.data);
    // Fetch sections directly
    const sec = await axios.get("/admin/sections").catch(() => ({ data: [] }));
    setSections(sec.data || []);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name.trim() || !sectionId) { setMsg("Fill all fields"); return; }
    setLoading(true);
    try {
      await axios.post("/admin/batches", { name: name.trim(), sectionId, strength: Number(strength) });
      setName(""); setSectionId(""); setStrength(20);
      setMsg("Batch created!");
      await load();
    } catch (e) {
      setMsg(e.response?.data?.message || "Error creating batch");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this batch?")) return;
    await axios.delete(`/admin/batches/${id}`);
    await load();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">⚙️ Admin</p>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Batches</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
          Create lab batches linked to sections. Labs are assigned per batch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

        {/* ── Add Batch Form ── */}
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-base">➕</div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 dark:text-white">Add Batch</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">e.g. Batch A, Batch B</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1 block">
                Batch Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Batch A"
                className="w-full px-3 py-2 text-sm rounded-xl
                  bg-gray-50 dark:bg-white/[0.04]
                  border border-gray-200 dark:border-white/[0.08]
                  text-gray-800 dark:text-slate-200
                  focus:outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1 block">
                Section
              </label>
              {sections.length === 0 ? (
                <p className="text-xs text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10
                  border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2">
                  ⚠ No sections found. Create a section first.
                </p>
              ) : (
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl
                    bg-gray-50 dark:bg-white/[0.04]
                    border border-gray-200 dark:border-white/[0.08]
                    text-gray-800 dark:text-slate-200
                    focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Select section…</option>
                  {sections.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} — {s.program?.toUpperCase()} S{s.sem}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1 block">
                Strength
              </label>
              <input
                type="number"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                min={1}
                className="w-full px-3 py-2 text-sm rounded-xl
                  bg-gray-50 dark:bg-white/[0.04]
                  border border-gray-200 dark:border-white/[0.08]
                  text-gray-800 dark:text-slate-200
                  focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {msg && (
              <p className={`text-xs font-medium px-3 py-2 rounded-xl border
                ${msg.includes("!") || msg.includes("created")
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                }`}>
                {msg}
              </p>
            )}

            <button
              onClick={handleAdd}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                shadow-md shadow-blue-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating…</>
                : "Create Batch"
              }
            </button>
          </div>
        </div>

        {/* ── Batches List ── */}
        <div className="md:col-span-2 bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">All Batches</p>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full
              bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {batches.length} total
            </span>
          </div>

          {batches.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm font-bold text-gray-500 dark:text-slate-400">No batches yet</p>
              <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">Create a batch to assign labs</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {batches.map((b) => (
                <div key={b._id} className="flex items-center justify-between px-5 py-3.5
                  hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                      flex items-center justify-center text-sm font-extrabold text-emerald-500">
                      {b.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{b.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                        {b.sectionId?.name
                          ? `${b.sectionId.name} · ${b.sectionId.program?.toUpperCase()} S${b.sectionId.sem}`
                          : "No section"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 dark:text-slate-500">
                      👥 {b.strength}
                    </span>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs
                        bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20
                        hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}