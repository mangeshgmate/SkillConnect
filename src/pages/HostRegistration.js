import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HostRegistration() {
  const [form, setForm] = useState({ name: "", email: "", password: "", org: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/host-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "host" })
    });

    const data = await res.json();

    if (data.success) {
      alert("Host registration successful"); // Print success message
      navigate("/host-login");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Server is not responding. Check if backend is running on port 5000.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-base">
      <form onSubmit={handleSubmit} className="p-8 border border-primary rounded-xl flex flex-col gap-4 w-96">
        <h2 className="text-2xl font-bold text-primary">Host Registration</h2>
        <input type="text" placeholder="Organization Name" className="p-2 bg-transparent border rounded" onChange={e => setForm({...form, org: e.target.value})} required />
        <input type="text" placeholder="Full Name" className="p-2 bg-transparent border rounded" onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="p-2 bg-transparent border rounded" onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="p-2 bg-transparent border rounded" onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="bg-primary text-black p-2 rounded font-bold">Register as Host</button>
      </form>
    </div>
  );
}
