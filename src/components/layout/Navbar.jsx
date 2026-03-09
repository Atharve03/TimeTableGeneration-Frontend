import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";

export default function Navbar({ title, onMenuOpen }) {
  const { isDark, toggle } = useTheme();
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = user?.role === "admin";

  return (
    <header className="
      sticky top-0 z-30 h-14 flex items-center justify-between
      px-4 sm:px-6
      bg-white dark:bg-[#0c111e]
      border-b border-gray-200 dark:border-white/[0.06]
      backdrop-blur-md
    ">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuOpen}
          className="
            lg:hidden
            w-9 h-9 flex items-center justify-center rounded-lg
            text-gray-500 dark:text-slate-400
            hover:bg-gray-100 dark:hover:bg-white/[0.06]
            border border-gray-200 dark:border-white/[0.08]
            transition-colors text-base
          "
        >
          ☰
        </button>

        {/* Page title */}
        <h1 className="text-sm font-semibold text-gray-600 dark:text-slate-400">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? "Switch to Light" : "Switch to Dark"}
          className="
            w-9 h-9 flex items-center justify-center rounded-lg text-base
            text-gray-500 dark:text-slate-400
            hover:bg-gray-100 dark:hover:bg-white/[0.06]
            border border-gray-200 dark:border-white/[0.08]
            transition-colors
          "
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* User pill */}
        <div className="
          hidden sm:flex items-center gap-2
          bg-gray-100 dark:bg-white/[0.05]
          border border-gray-200 dark:border-white/[0.08]
          rounded-xl px-2 py-1.5
        ">
          {/* Avatar */}
          <div className={`
            w-6 h-6 rounded-full shrink-0
            flex items-center justify-center
            text-[10px] font-extrabold text-white
            ${isAdmin
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-blue-500 to-violet-600"
            }
          `}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 capitalize mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout — text on sm+, icon on xs */}
        <button
          onClick={logout}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            text-red-500 dark:text-red-400
            bg-red-50 dark:bg-red-500/10
            border border-red-200 dark:border-red-500/20
            hover:bg-red-100 dark:hover:bg-red-500/20
            transition-colors
          "
        >
          <span>⏻</span>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}