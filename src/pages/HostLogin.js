import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HostLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();const handleHostLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/host-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      // 1. Save host data to localStorage
      localStorage.setItem("hostUser", JSON.stringify(data.host));

      // 2. TRIGGER NAVBAR UPDATE
      // This manually tells the Navbar to run syncUser() immediately
      window.dispatchEvent(new Event("storage"));

      // 3. REDIRECT TO HOME
      navigate("/"); 
      
      alert("Welcome back, " + data.host.name);
    } else {
      alert(data.message || "Invalid Host Credentials");
    }
  } catch (error) {
    console.error("Host Login error:", error);
    alert("Server error. Check if your backend is running.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-base">
      <div className="p-8 border border-secondary rounded-xl flex flex-col gap-6 w-96 bg-black/40">
        <h2 className="text-3xl font-bold text-secondary text-center">Host Login</h2>

        <form className="flex flex-col gap-4" onSubmit={handleHostLogin}>
          <input 
            type="email" 
            placeholder="Organization Email" 
            className="p-2 bg-transparent border border-gray-600 rounded focus:border-secondary outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-2 bg-transparent border border-gray-600 rounded focus:border-secondary outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="bg-secondary text-black p-2 rounded font-bold hover:bg-opacity-90 transition-all">
            Login as Host
          </button>
        </form>

        <button 
          onClick={() => navigate("/host-registration")} 
          className="text-sm text-center text-gray-400 hover:text-secondary underline"
        >
          New Host? Register here
        </button>
      </div>
    </div>
  );
}