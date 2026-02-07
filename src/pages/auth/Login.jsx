import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4 font-semibold text-center">Login</h2>

        <input
          className="w-full p-2 border mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => (window.location.href = "/register")}
          className="w-full bg-gray-600 text-white p-2 rounded mt-2"
        >
          Register
        </button>

        <button
          onClick={() => login(email, password)}
          className="w-full bg-blue-600 text-white p-2 rounded mt-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
