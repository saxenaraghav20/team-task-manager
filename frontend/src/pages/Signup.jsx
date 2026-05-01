import { useState } from "react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role: "member",
      });

      alert("Signup successful! Please login.");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">
  Team Task Manager
</h1>

<h2 className="text-3xl font-bold text-white mb-6 text-center">
  Signup
</h2>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white outline-none"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

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
          className="w-full bg-green-500 hover:bg-green-600 p-3 rounded text-white font-semibold"
          onClick={handleSignup}
        >
          Signup
        </button>

        <p
          className="mt-4 text-sm text-center text-gray-400 cursor-pointer hover:text-white"
          onClick={() => (window.location.href = "/")}
        >
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}

export default Signup;