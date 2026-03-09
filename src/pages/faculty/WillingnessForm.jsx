import { useEffect, useState } from "react";
import FacultyLayout from "../../components/layout/FacultyLayout";
import { useFacultyStore } from "../../store/facultyStore";
import SlotSelector from "../../components/timetable/SlotSelector";
import { DAYS } from "../../components/timetable/TimetableGrid";
import axios from "../../api/axiosInstance";

const PROGRAMS = [
  { value: "btech", label: "B.Tech", sems: 8, color: "blue"   },
  { value: "mtech", label: "M.Tech", sems: 4, color: "violet" },
];

const STEP_LABELS = ["Program", "Semesters", "Subjects", "Availability"];

const TIME_LABELS = [
  "08:00","08:50","09:45","10:40","11:35",
  "12:30","01:25","02:20","03:10","04:00",
];

// ── helper ────────────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {STEP_LABELS.map((label, i) => {
        const num  = i + 1;
        const past = step > num;
        const cur  = step === num;
        return (
          <div key={label} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className={`flex items-center gap-1.5 shrink-0`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${past ? "bg-emerald-500 border-emerald-500 text-white"
                  : cur  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500"}`}>
                {past ? "✓" : num}
              </div>
              <span className={`text-xs font-semibold hidden sm:block
                ${cur ? "text-gray-800 dark:text-slate-200" : "text-gray-400 dark:text-slate-600"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded transition-all
                ${past ? "bg-emerald-400" : "bg-gray-200 dark:bg-white/[0.08]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WillingnessForm() {
  const { submitWillingness } = useFacultyStore();

  // Step state
  const [step,       setStep]       = useState(1);
  const [program,    setProgram]    = useState("");               // "btech" | "mtech"
  const [selSems,    setSelSems]    = useState([]);               // [1,2,3...]
  const [semSubjects,setSemSubjects]= useState({});               // { sem: [subjectId,...] }
  const [avail,      setAvail]      = useState(
    Object.fromEntries(DAYS.map((d) => [d, []]))
  );
  const [allSubjects,setAllSubjects]= useState([]);               // all subjects for chosen program
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [loadingSubs,setLoadingSubs]= useState(false);

  // Load subjects when program changes
  useEffect(() => {
    if (!program) return;
    setLoadingSubs(true);
    axios.get(`/admin/subjects?program=${program}`)
      .then((r) => setAllSubjects(r.data))
      .catch(() => setAllSubjects([]))
      .finally(() => setLoadingSubs(false));
  }, [program]);

  const maxSems = PROGRAMS.find((p) => p.value === program)?.sems || 8;

  const toggleSem = (s) =>
    setSelSems((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s].sort((a, b) => a - b)
    );

  const toggleSubject = (sem, subId) =>
    setSemSubjects((prev) => {
      const cur = prev[sem] || [];
      return {
        ...prev,
        [sem]: cur.includes(subId) ? cur.filter((x) => x !== subId) : [...cur, subId],
      };
    });

  const submit = async () => {
    setSubmitting(true);
    try {
      const semesters = selSems.map((sem) => ({
        sem,
        program,
        subjects: semSubjects[sem] || [],
      }));
      await submitWillingness({ semesters, availability: avail });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setProgram(""); setSelSems([]);
    setSemSubjects({}); setAvail(Object.fromEntries(DAYS.map((d) => [d, []])));
    setDone(false);
  };

  // ── Success ──────────────────────────────────────────────────
  if (done) return (
    <FacultyLayout title="Willingness Form">
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
          rounded-3xl p-10 text-center max-w-sm w-full animate-scale-in">
          <span className="text-6xl block mb-4 animate-float">🎉</span>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">Submitted!</h2>
          <p className="text-sm text-gray-500 dark:text-slate-500 leading-relaxed">
            Your willingness form has been submitted. The admin will review and approve it before generating your timetable.
          </p>
          <button onClick={reset}
            className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white
              bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
              shadow-md shadow-blue-500/20 transition-all">
            Submit Again
          </button>
        </div>
      </div>
    </FacultyLayout>
  );

  return (
    <FacultyLayout title="Willingness Form">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4 animate-fade-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Willingness Form
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
            Tell us which semesters and subjects you can teach
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Step bar */}
        <StepBar step={step} />

        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-6 animate-scale-in">

          {/* ── STEP 1: Program ── */}
          {step === 1 && (
            <>
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">🎓 Select Your Program</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Choose the program you are teaching in</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {PROGRAMS.map((p) => (
                  <button key={p.value} onClick={() => setProgram(p.value)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98]
                      ${program === p.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                        : "border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/[0.15]"
                      }`}>
                    <span className="text-3xl">{p.value === "btech" ? "🎓" : "🔬"}</span>
                    <div className="text-center">
                      <p className={`text-base font-extrabold ${program === p.value ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-slate-200"}`}>
                        {p.label}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                        Sem 1 – {p.sems}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={() => setStep(2)} disabled={!program}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                  bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                  shadow-md shadow-blue-500/20
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-150">
                Next: Choose Semesters →
              </button>
            </>
          )}

          {/* ── STEP 2: Semesters ── */}
          {step === 2 && (
            <>
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">
                  📅 Select Semesters — {PROGRAMS.find((p) => p.value === program)?.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  Choose all semesters you can teach (multiple allowed)
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {Array.from({ length: maxSems }, (_, i) => i + 1).map((sem) => {
                  const sel = selSems.includes(sem);
                  return (
                    <button key={sem} onClick={() => toggleSem(sem)}
                      className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-150 active:scale-95
                        ${sel
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                          : "border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/[0.15]"
                        }`}>
                      <span className={`text-xl font-extrabold font-mono
                        ${sel ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-slate-300"}`}>
                        {sem}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500">
                        Sem {sem}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selSems.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Selected:</span>
                  {selSems.map((s) => (
                    <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-full
                      bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                      Sem {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold
                    bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-300
                    border border-gray-200 dark:border-white/[0.08]
                    hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} disabled={!selSems.length}
                  className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white
                    bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                    shadow-md shadow-blue-500/20
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
                    transition-all duration-150">
                  Next: Choose Subjects →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Subjects per sem ── */}
          {step === 3 && (
            <>
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">📚 Select Subjects per Semester</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  Choose subjects you're willing to teach in each semester
                </p>
              </div>

              {loadingSubs ? (
                <div className="flex items-center justify-center py-10 gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin-ring" />
                  <p className="text-sm text-gray-400">Loading subjects…</p>
                </div>
              ) : (
                <div className="space-y-5 mb-6 max-h-[420px] overflow-y-auto pr-1">
                  {selSems.map((sem) => {
                    const semSubs = allSubjects.filter((s) => s.sem === sem);
                    const chosen  = semSubjects[sem] || [];
                    return (
                      <div key={sem} className="rounded-xl border border-gray-200 dark:border-white/[0.07] overflow-hidden">
                        {/* Sem header */}
                        <div className="flex items-center justify-between px-4 py-2.5
                          bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold font-mono text-blue-600 dark:text-blue-400">
                              SEM {sem}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-slate-600">
                              {program.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full
                            bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            {chosen.length} selected
                          </span>
                        </div>

                        {/* Subjects list */}
                        {!semSubs.length ? (
                          <p className="text-xs text-center py-4 text-gray-400 dark:text-slate-500">
                            No subjects found for Sem {sem}. Ask admin to add subjects.
                          </p>
                        ) : (
                          <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                            {semSubs.map((sub) => {
                              const sel = chosen.includes(sub._id);
                              return (
                                <button key={sub._id}
                                  onClick={() => toggleSubject(sem, sub._id)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                                    ${sel
                                      ? "bg-blue-50 dark:bg-blue-500/10"
                                      : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                    }`}>
                                  <div className={`w-5 h-5 rounded-md shrink-0 border-2 flex items-center justify-center text-[10px] font-bold transition-all
                                    ${sel ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 dark:border-slate-600"}`}>
                                    {sel && "✓"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{sub.name}</p>
                                    <p className="text-xs font-mono text-gray-400 dark:text-slate-500 mt-0.5">
                                      {sub.code} · {sub.isLab ? "🔬 Lab" : "📖 Theory"} · {sub.weeklyLectures}×/week
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold
                    bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-300
                    border border-gray-200 dark:border-white/[0.08]
                    hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={selSems.some((s) => !(semSubjects[s]?.length))}
                  className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white
                    bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                    shadow-md shadow-blue-500/20
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
                    transition-all duration-150">
                  Next: Set Availability →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 4: Availability ── */}
          {step === 4 && (
            <>
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">📅 Mark Your Availability</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  Tap slot numbers where you're free to teach across each day order
                </p>
              </div>

              {/* Slot time legend */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 p-3 mb-5 rounded-xl
                bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                {TIME_LABELS.map((t, i) => (
                  <span key={i} className="text-[10px] font-mono text-gray-400 dark:text-slate-600">
                    <span className="font-bold text-gray-600 dark:text-slate-400">S{i + 1}</span> {t}
                  </span>
                ))}
              </div>

              <div className="space-y-4 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {DAYS.map((day) => (
                  <div key={day}>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs font-bold text-gray-600 dark:text-slate-400 font-mono">{day}</p>
                      {avail[day].length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                          bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {avail[day].length} slots
                        </span>
                      )}
                    </div>
                    <SlotSelector
                      selectedSlots={avail[day]}
                      setSelectedSlots={(slots) => setAvail((p) => ({ ...p, [day]: slots }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold
                    bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-300
                    border border-gray-200 dark:border-white/[0.08]
                    hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                  ← Back
                </button>
                <button onClick={submit} disabled={submitting}
                  className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white
                    bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                    shadow-md shadow-blue-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    transition-all duration-150 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />Submitting…</>
                  ) : "📋 Submit Willingness"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}