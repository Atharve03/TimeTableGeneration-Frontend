import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useAdminStore } from "../../store/adminStore";

const STEPS = [
  { icon: "🔍", label: "Analyzing teacher availability" },
  { icon: "🔬", label: "Placing lab sessions" },
  { icon: "📖", label: "Scheduling theory lectures" },
  { icon: "⚖️", label: "Resolving conflicts" },
  { icon: "💾", label: "Saving to database" },
];

export default function GenerateTimetable() {
  const { generateTimetable, loading } = useAdminStore();
  const [done,  setDone]  = useState(false);
  const [step,  setStep]  = useState(-1);
  const [count, setCount] = useState(0);

  const handle = async () => {
    setDone(false); setStep(0);
    const iv = setInterval(() => setStep((p) => Math.min(p + 1, STEPS.length - 1)), 900);
    const res = await generateTimetable();
    clearInterval(iv);
    setStep(STEPS.length);
    setCount(res?.result?.length || 0);
    setDone(true);
  };

  return (
    <AdminLayout title="Generate Timetable">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Generate Timetable</h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Run the 2-phase timetable allocation engine</p>
        </div>
      </div>

      <div className="max-w-md">
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-7 animate-scale-in">

          <div className="flex flex-col items-center text-center mb-7">
            <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-3xl
              bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-500/20
              ${loading ? "animate-spin-ring border-t-amber-500" : "animate-float"}`}>
              ⚡
            </div>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Timetable Engine</h2>
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1 leading-relaxed max-w-xs">
              Automatically allocates labs and lectures, resolving all conflicts across 5 day orders and 10 slots.
            </p>
          </div>

          <div className="mb-6 space-y-2">
            {STEPS.map((s, i) => {
              const past   = done || step > i;
              const active = loading && step === i;
              return (
                <div key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300
                    ${past   ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" :
                      active ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" :
                               "bg-gray-50 dark:bg-white/[0.03] border-gray-100 dark:border-white/[0.05]"}`}>
                  <span className="text-base">{past ? "✅" : active ? "⏳" : s.icon}</span>
                  <span className={`text-sm font-medium transition-colors
                    ${past   ? "text-emerald-700 dark:text-emerald-400" :
                      active ? "text-amber-700 dark:text-amber-400" :
                               "text-gray-500 dark:text-slate-500"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {done && (
            <div className="text-center py-4 mb-5 rounded-2xl
              bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 animate-scale-in">
              <span className="text-3xl block mb-2">🎉</span>
              <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">Generated Successfully!</p>
              {count > 0 && <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{count} entries created</p>}
            </div>
          )}

          <button onClick={handle} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white
              bg-amber-500 hover:bg-amber-400 active:scale-[0.98]
              shadow-lg shadow-amber-500/20
              disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
              transition-all duration-150 flex items-center justify-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />Generating…</>
            ) : "⚡ Generate Timetable"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}