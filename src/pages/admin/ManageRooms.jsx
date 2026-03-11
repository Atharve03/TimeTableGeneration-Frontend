import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "../../api/axiosInstance";

const ROOM_TYPES = [
  { value: "theory", label: "Theory", icon: "📖", color: "blue"    },
  { value: "lab",    label: "Lab",    icon: "🔬", color: "emerald"  },
  { value: "both",   label: "Both",   icon: "🏫", color: "violet"   },
];

export default function ManageRooms() {
  const [rooms,    setRooms]    = useState([]);
  const [name,     setName]     = useState("");
  const [type,     setType]     = useState("theory");
  const [capacity, setCapacity] = useState(60);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");

  const load = async () => {
    const res = await axios.get("/admin/rooms").catch(() => ({ data: [] }));
    setRooms(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) { setMsg("Room name is required"); return; }
    setLoading(true);
    try {
      await axios.post("/admin/rooms", { name: name.trim().toUpperCase(), type, capacity: Number(capacity) });
      setName(""); setType("theory"); setCapacity(60);
      setMsg("Room created!");
      await load();
    } catch (e) {
      setMsg(e.response?.data?.error || "Error creating room");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this room?")) return;
    await axios.delete(`/admin/rooms/${id}`);
    await load();
  };

  const grouped = {
    theory: rooms.filter((r) => r.type === "theory"),
    lab:    rooms.filter((r) => r.type === "lab"),
    both:   rooms.filter((r) => r.type === "both"),
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">⚙️ Admin</p>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Rooms</h1>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
          Add classrooms and labs. These rooms will be used when generating the timetable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

        {/* ── Add Room ── */}
        <div className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">🏫</div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 dark:text-white">Add Room</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">e.g. ROOM-101, LAB-1</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1 block">Room Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ROOM-101"
                className="w-full px-3 py-2 text-sm rounded-xl
                  bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08]
                  text-gray-800 dark:text-slate-200 focus:outline-none focus:border-blue-400 transition-colors" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1 block">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {ROOM_TYPES.map((t) => (
                  <button key={t.value} onClick={() => setType(t.value)}
                    className={`py-2 rounded-xl text-xs font-bold border-2 transition-all
                      ${type === t.value
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-slate-400 hover:border-blue-400"
                      }`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1 block">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} min={1}
                className="w-full px-3 py-2 text-sm rounded-xl
                  bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08]
                  text-gray-800 dark:text-slate-200 focus:outline-none focus:border-blue-400 transition-colors" />
            </div>

            {msg && (
              <p className={`text-xs font-medium px-3 py-2 rounded-xl border
                ${msg.includes("!") ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"}`}>
                {msg}
              </p>
            )}

            <button onClick={handleAdd} disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                bg-blue-600 hover:bg-blue-500 active:scale-[0.98] shadow-md shadow-blue-500/20
                disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Adding…</>
                : "Add Room"}
            </button>
          </div>
        </div>

        {/* ── Rooms List ── */}
        <div className="md:col-span-2 space-y-4">
          {ROOM_TYPES.map(({ value, label, icon, color }) => {
            const list = grouped[value];
            if (!list.length) return null;
            const colorMap = {
              blue:    "bg-blue-500/10 border-blue-500/20 text-blue-500",
              emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
              violet:  "bg-violet-500/10 border-violet-500/20 text-violet-500",
            };
            return (
              <div key={value} className="bg-white dark:bg-[#0f1626] border border-gray-200 dark:border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorMap[color]}`}>
                    {icon} {label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-600">{list.length} rooms</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                  {list.map((room) => (
                    <div key={room._id} className="flex items-center justify-between px-5 py-3
                      hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold border ${colorMap[color]}`}>
                          {room.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-slate-200 font-mono">{room.name}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500">👥 {room.capacity} seats</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(room._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs
                          bg-red-50 dark:bg-red-500/10 text-red-500 border border-red-200 dark:border-red-500/20
                          hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {!rooms.length && (
            <div className="flex items-center justify-center h-40
              bg-white dark:bg-[#0f1626] border border-dashed border-gray-200 dark:border-white/[0.07] rounded-2xl">
              <div className="text-center">
                <span className="text-3xl block mb-2">🏫</span>
                <p className="text-sm text-gray-400 dark:text-slate-500">No rooms added yet</p>
                <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">Add rooms to use in timetable generation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}