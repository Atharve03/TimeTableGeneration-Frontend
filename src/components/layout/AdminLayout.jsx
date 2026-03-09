import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";

export default function AdminLayout({ children, title = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#070c18] overflow-hidden">
      <Sidebar role="admin" isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title={title} onMenuOpen={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

