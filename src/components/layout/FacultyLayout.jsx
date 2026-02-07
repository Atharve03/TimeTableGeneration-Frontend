import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function FacultyLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar role="faculty" />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar title="Faculty Portal" />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
