import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Login    from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminRoutes   from "./routes/AdminRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Login />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*"  element={<AdminRoutes />} />
          <Route path="/faculty/*" element={<FacultyRoutes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}