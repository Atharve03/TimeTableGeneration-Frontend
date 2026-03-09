import { useState } from "react";
import axios from "../../api/axiosInstance";

export default function Register() {
  const [form,    setForm]    = useState({ name: "", email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [show,    setShow]    = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.role) { setError("Please select a role"); return; }
    if (!form.name || !form.email || !form.password) { setError("All fields are required"); return; }
    setLoading(true); setError("");
    try {
      await axios.post("/auth/register", form);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",     label: "Full Name",       type: "text",     ph: "Dr. John Smith" },
    { key: "email",    label: "Email Address",    type: "email",    ph: "john@college.edu" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gray-50 dark:bg-[#070c18] p-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full
        bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full
        bg-blue-600/8 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 animate-scale-in">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-2xl
            bg-gradient-to-br from-violet-500 to-blue-600
            flex items-center justify-center text-xl">🎓</div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">TimetableX</span>
        </div>

        <div className="bg-white dark:bg-[#0f1626]
          border border-gray-200 dark:border-white/[0.07]
          rounded-3xl p-8 shadow-xl dark:shadow-black/40">

          <div className="text-center mb-7">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Join TimetableX</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl
              bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25
              text-rose-600 dark:text-rose-400 text-sm animate-scale-in">
              ⚠️ {error}
            </div>
          )}

          {fields.map((f) => (
            <div key={f.key} className="mb-4">
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
                text-gray-500 dark:text-slate-500">
                {f.label}
              </label>
              <input
                type={f.type}
                placeholder={f.ph}
                value={form[f.key]}
                onChange={set(f.key)}
                className="w-full px-4 py-2.5 text-sm rounded-xl
                  bg-gray-100 dark:bg-white/[0.05]
                  border border-gray-200 dark:border-white/[0.08]
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-slate-600
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                  transition-all"
              />
            </div>
          ))}

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
              text-gray-500 dark:text-slate-500">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={set("password")}
                className="w-full px-4 py-2.5 pr-11 text-sm rounded-xl
                  bg-gray-100 dark:bg-white/[0.05]
                  border border-gray-200 dark:border-white/[0.08]
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-slate-600
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                  transition-all"
              />
              <button onClick={() => setShow((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300
                  transition-colors text-sm">
                {show ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide
              text-gray-500 dark:text-slate-500">
              Role
            </label>
            <select
              value={form.role}
              onChange={set("role")}
              className="w-full px-4 py-2.5 text-sm rounded-xl cursor-pointer appearance-none
                bg-gray-100 dark:bg-white/[0.05]
                border border-gray-200 dark:border-white/[0.08]
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                transition-all"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white
              bg-violet-600 hover:bg-violet-500 active:scale-[0.98]
              shadow-lg shadow-violet-500/25
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-ring" />
                Creating…
              </>
            ) : "Create Account →"}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-slate-500 mt-5">
            Already have an account?{" "}
            <a href="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}