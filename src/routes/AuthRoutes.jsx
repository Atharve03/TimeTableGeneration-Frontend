import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { Routes, Route } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
