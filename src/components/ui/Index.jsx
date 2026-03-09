// ─────────────────────────────────────────────────────────────
//  Shared UI Primitives
//  src/components/ui/index.jsx
// ─────────────────────────────────────────────────────────────

// ── BUTTON ───────────────────────────────────────────────────
const variants = {
  primary:   "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 border-transparent",
  secondary: "bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-slate-300 border-gray-200 dark:border-white/[0.08] hover:bg-gray-200 dark:hover:bg-white/[0.1]",
  danger:    "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20 border-transparent",
  ghost:     "bg-transparent text-gray-500 dark:text-slate-400 border-transparent hover:bg-gray-100 dark:hover:bg-white/[0.06]",
  success:   "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-transparent",
  warning:   "bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/20 border-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-5 py-3 text-sm rounded-xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-bold border
        transition-all duration-150 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading && (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin-ring" />
      )}
      {children}
    </button>
  );
}

// ── CARD ─────────────────────────────────────────────────────
export function Card({ children, className = "", hover = false }) {
  return (
    <div className={`
      bg-white dark:bg-[#0f1626]
      border border-gray-200 dark:border-white/[0.07]
      rounded-2xl
      ${hover ? "hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 cursor-pointer" : ""}
      ${className}
    `}>
      {children}
    </div>
  );
}

// ── BADGE ────────────────────────────────────────────────────
const badgeVariants = {
  blue:    "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  violet:  "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
  green:   "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  amber:   "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  rose:    "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  gray:    "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-slate-400 border-gray-200 dark:border-white/[0.08]",
};

export function Badge({ children, variant = "gray", className = "" }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-1 rounded-full
      text-[10px] font-bold border
      ${badgeVariants[variant]} ${className}
    `}>
      {children}
    </span>
  );
}

// ── INPUT ────────────────────────────────────────────────────
export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  error = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-xl
          bg-gray-100 dark:bg-white/[0.05]
          border ${error ? "border-rose-500" : "border-gray-200 dark:border-white/[0.08]"}
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-slate-600
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          transition-all
        `}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ── SELECT ───────────────────────────────────────────────────
export function Select({ label, value, onChange, options = [], className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl cursor-pointer appearance-none
          bg-gray-100 dark:bg-white/[0.05]
          border border-gray-200 dark:border-white/[0.08]
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── LOADER ───────────────────────────────────────────────────
export function Loader({ text = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 py-20 ${className}`}>
      <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500 animate-spin-ring" />
      <p className="text-sm text-gray-400 dark:text-slate-500">{text}</p>
    </div>
  );
}

// ── STAT CARD ────────────────────────────────────────────────
const statColors = {
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   text: "text-blue-500 dark:text-blue-400"   },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-500 dark:text-violet-400" },
  green:  { bg: "bg-emerald-500/10",border: "border-emerald-500/20",text: "text-emerald-500 dark:text-emerald-400" },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-500 dark:text-amber-400"  },
  rose:   { bg: "bg-rose-500/10",   border: "border-rose-500/20",   text: "text-rose-500 dark:text-rose-400"   },
};

export function StatCard({ icon, label, value, color = "blue", className = "" }) {
  const c = statColors[color] || statColors.blue;
  return (
    <div className={`
      flex items-center gap-3 p-4
      bg-white dark:bg-[#0f1626]
      border border-gray-200 dark:border-white/[0.07]
      rounded-2xl hover:-translate-y-0.5 hover:shadow-lg
      transition-all duration-200
      ${className}
    `}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border ${c.bg} ${c.border}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xl font-extrabold font-mono leading-none ${c.text}`}>{value}</p>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── PAGE HEADER ──────────────────────────────────────────────
export function PageHeader({ title, subtitle, badge, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6 animate-fade-up">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {badge && <Badge variant={badge.variant || "gray"}>{badge.text}</Badge>}
        {children}
      </div>
    </div>
  );
}

// ── EMPTY STATE ──────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-12 text-center">
      <span className="text-5xl block mb-4 animate-float">{icon}</span>
      <p className="text-base font-bold text-gray-700 dark:text-slate-300">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── ALERT ────────────────────────────────────────────────────
const alertVariants = {
  success: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400",
  error:   "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/25 text-rose-700 dark:text-rose-400",
  warning: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/25 text-amber-700 dark:text-amber-400",
  info:    "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/25 text-blue-700 dark:text-blue-400",
};

const alertIcons = { success: "✅", error: "⚠️", warning: "⚠️", info: "ℹ️" };

export function Alert({ children, variant = "info", className = "" }) {
  return (
    <div className={`
      flex items-center gap-2 px-4 py-3 rounded-xl border text-sm animate-scale-in
      ${alertVariants[variant]} ${className}
    `}>
      <span>{alertIcons[variant]}</span>
      {children}
    </div>
  );
}

// ── SECTION LABEL ────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-600 whitespace-nowrap">
        {children}
      </p>
      <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.06]" />
    </div>
  );
}