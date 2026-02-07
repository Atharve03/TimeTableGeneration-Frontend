import { useState } from "react";
import axios from "../../api/axiosInstance";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.role) {
      alert("Please select a role!");
      return;
    }

    try {
      await axios.post("/auth/register", form);
      alert("Registration successful!");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-semibold text-center">Register</h2>

        <input
          name="name"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          name="email"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Password"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full p-2 border mb-3 rounded"
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white p-2 rounded mt-2"
        >
          Register
        </button>
      </div>
    </div>
  );
}
