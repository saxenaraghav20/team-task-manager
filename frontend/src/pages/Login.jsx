import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);
    console.log("TOKEN:", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        
        <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">
  Team Task Manager
</h1>

<h2 className="text-3xl font-bold text-white mb-6 text-center">
  Login
</h2>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded text-white font-semibold"
          onClick={handleLogin}
        >
          Login
        </button>

        <p
          className="mt-4 text-sm text-center text-gray-400 cursor-pointer hover:text-white"
          onClick={() => (window.location.href = "/signup")}
        >
          Don't have an account? Signup
        </p>

      </div>
    </div>
  );
}

export default Login;