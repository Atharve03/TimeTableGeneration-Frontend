import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// ── Time slots exported for use in timetable components ──────
export const TIME_SLOTS = [
  { s: 1,  f: "08:00", t: "08:50" },
  { s: 2,  f: "08:50", t: "09:40" },
  { s: 3,  f: "09:45", t: "10:35" },
  { s: 4,  f: "10:40", t: "11:30" },
  { s: 5,  f: "11:35", t: "12:25" },
  { s: 6,  f: "12:30", t: "01:20" },
  { s: 7,  f: "01:25", t: "02:15" },
  { s: 8,  f: "02:20", t: "03:10" },
  { s: 9,  f: "03:10", t: "04:00" },
  { s: 10, f: "04:00", t: "04:50" },
];

export const DAYS = [
  "Day Order 1", "Day Order 2", "Day Order 3",
  "Day Order 4", "Day Order 5",
];

// ── Nav item ─────────────────────────────────────────────────
function NavItem({ to, icon, label, isAdmin, onClose }) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
         transition-all duration-150 border
         ${isActive
           ? isAdmin
             ? "bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold"
             : "bg-blue-500/10 text-blue-400 border-blue-500/20 font-semibold"
           : "text-slate-400 dark:text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-200"
         }`
      }
    >
      <span className="text-base w-5 text-center shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

// ── Section header ────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-600 px-3 pt-4 pb-1.5">
      {children}
    </p>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
export default function Sidebar({ role, isOpen, onClose }) {
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = role === "admin";

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-60 z-50 flex flex-col
          bg-[#0c111e] border-r border-white/[0.06]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-lg
              ${isAdmin
                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                : "bg-gradient-to-br from-blue-500 to-violet-600"
              }`}
          >
            {isAdmin ? "🏫" : "📅"}
          </div>
          <div>
            <p className="text-sm font-extrabold text-white leading-none">TimetableX</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5
              ${isAdmin ? "text-amber-400" : "text-blue-400"}`}>
              {isAdmin ? "Admin Panel" : "Faculty Portal"}
            </p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="ml-auto text-slate-500 hover:text-slate-300 lg:hidden transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {isAdmin ? (
            <>
              <SectionLabel>Overview</SectionLabel>
              <NavItem to="/admin/dashboard"          icon="⊞"  label="Dashboard"      isAdmin onClose={onClose} />
              <SectionLabel>Management</SectionLabel>
              <NavItem to="/admin/teachers"           icon="👥" label="Teachers"        isAdmin onClose={onClose} />
              <NavItem to="/admin/subjects"           icon="📚" label="Subjects"         isAdmin onClose={onClose} />
              <NavItem to="/admin/assign-subject"     icon="🔗" label="Assign Subjects"  isAdmin onClose={onClose} />
              <NavItem to="/admin/semester"           icon="🗓" label="Set Semester"     isAdmin onClose={onClose} />
              <SectionLabel>Timetable</SectionLabel>
              <NavItem to="/admin/willingness"        icon="✋" label="Willingness"      isAdmin onClose={onClose} />
              <NavItem to="/admin/timetable/generate" icon="⚡" label="Generate"         isAdmin onClose={onClose} />
              <NavItem to="/admin/timetable/view"     icon="👁" label="View Timetable"   isAdmin onClose={onClose} />
              <NavItem to="/admin/timetable/edit"     icon="✏️" label="Edit Timetable"   isAdmin onClose={onClose} />
            </>
          ) : (
            <>
              <SectionLabel>Overview</SectionLabel>
              <NavItem to="/faculty/dashboard"   icon="⊞"  label="Dashboard"        onClose={onClose} />
              <SectionLabel>My Work</SectionLabel>
              <NavItem to="/faculty/subjects"    icon="📖" label="My Subjects"       onClose={onClose} />
              <NavItem to="/faculty/willingness" icon="📋" label="Willingness Form"  onClose={onClose} />
              <NavItem to="/faculty/timetable"   icon="🗓" label="My Timetable"      onClose={onClose} />
            </>
          )}
        </nav>

        {/* Footer — user chip + logout */}
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center
              text-xs font-extrabold text-white
              ${isAdmin
                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                : "bg-gradient-to-br from-blue-500 to-violet-600"
              }`}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-700 text-slate-200 truncate leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-500 capitalize mt-0.5">{user?.role}</p>
            </div>
            {/* Logout */}
            <button
              onClick={logout}
              title="Logout"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400
                bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}