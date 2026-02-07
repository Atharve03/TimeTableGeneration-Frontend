import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar title="Admin Panel" />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
