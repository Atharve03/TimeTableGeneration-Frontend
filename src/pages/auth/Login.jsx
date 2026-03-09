import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const login   = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error   = useAuthStore((s) => s.error);

  const [email, setEmail] = useState("");
  const [pwd,   setPwd]   = useState("");
  const [show,  setShow]  = useState(false);

  const submit = () => login(email, pwd);

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#070c18]">

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden
        bg-[#090e1c] border-r border-white/[0.06]
        items-center justify-center p-12 gap-8">

        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40" />

        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo mark */}
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6
            bg-gradient-to-br from-blue-500 to-violet-600
            flex items-center justify-center text-4xl
            shadow-2xl shadow-blue-500/30 animate-float">
            🏫
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            TimetableX
          </h1>
          <p className="text-slate-400 mt-3 text-sm leading-relaxed">
            Intelligent conflict-free timetable generation for modern colleges
          </p>

          {/* Feature list */}
          <div className="mt-8 flex flex-col gap-3 text-left">
            {[
              { icon: "⚡", text: "Auto-conflict resolution across 5 day orders" },
              { icon: "🔬", text: "Smart lab & theory slot allocation" },
              { icon: "👥", text: "Faculty availability matrix support" },
            ].map((f, i) => (
              <div key={i}
                className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07]
                  rounded-xl px-4 py-3 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}>
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm text-slate-400">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right login form ── */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-scale-in">

          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600
              flex items-center justify-center text-xl">🏫</div>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">TimetableX</span>
          </div>

          <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07]
            rounded-3xl p-8 shadow-xl dark:shadow-black/40">

            <div className="text-center mb-7">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-4
                bg-blue-500/10 border border-blue-500/20
                flex items-center justify-center text-2xl">🔐</div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Welcome back</h2>
              <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl
                bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25
                text-rose-600 dark:text-rose-400 text-sm animate-scale-in">
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
                text-gray-500 dark:text-slate-500">
                Email address
              </label>
              <input
                type="email"
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                className="w-full px-4 py-2.5 text-sm rounded-xl
                  bg-gray-100 dark:bg-white/[0.05]
                  border border-gray-200 dark:border-white/[0.08]
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-slate-600
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                  transition-all"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
                text-gray-500 dark:text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onKeyDown={handleKey}
                  className="w-full px-4 py-2.5 pr-11 text-sm rounded-xl
                    bg-gray-100 dark:bg-white/[0.05]
                    border border-gray-200 dark:border-white/[0.08]
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-slate-600
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    transition-all"
                />
                <button
                  onClick={() => setShow((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300
                    transition-colors text-sm"
                >{show ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white
                bg-blue-600 hover:bg-blue-500 active:scale-[0.98]
                shadow-lg shadow-blue-500/25
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                transition-all duration-150 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-slate-500 mt-5">
              Don't have an account?{" "}
              <a href="/register"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}