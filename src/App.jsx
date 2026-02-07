import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminRoutes from "./routes/AdminRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Faculty */}
        <Route path="/faculty/*" element={<FacultyRoutes />} />

      </Routes>
    </BrowserRouter>
  );
}
