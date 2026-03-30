import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: ""
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);

    // Later you can send this to Flask backend
    navigate("/join");
  };

  return (
    <div className="auth-container bg-base  flex items-center justify-center">
      
      <div className="reg-card flex flex-col items-center justify-center text-white">
        
        <h2 className="font-primary text-3xl mb-6">
          Hackathon Registration
        </h2>

        <div className="border border-primary p-6 rounded-lg bg-base">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-black w-80"
          >

            <div className="flex flex-col">
              <label className="text-sm text-muted mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="p-2 rounded border focus:outline-none focus:ring-2 bg-base focus:ring-primary"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted mb-1">Email ID</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="p-2 rounded border focus:outline-none focus:ring-2 bg-base focus:ring-primary"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted mb-1">
                GitHub Profile Link
              </label>
              <input
                type="url"
                required
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
                placeholder="https://github.com/username"
                className="p-2 rounded border focus:outline-none focus:ring-2 bg-base focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="bg-primary p-2 text-base font-bold text-black rounded hover:opacity-90 transition"
            >
              Submit & Continue
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default RegistrationPage;

