import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HostDetails() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-base px-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
          Host Your Own Hackathon
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Empower innovation, discover top talent, and build the future of tech.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Registration Card */}
        <div className="p-8 border border-primary/30 rounded-2xl bg-black/40 hover:border-primary transition-all flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">New Host?</h2>
          <p className="text-gray-400 mb-6 text-sm">Create an account for your organization to start posting events.</p>
          <button 
            onClick={() => navigate("/host-register")}
            className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-transform"
          >
            Host Registration
          </button>
        </div>

        {/* Login Card */}
        <div className="p-8 border border-secondary/30 rounded-2xl bg-black/40 hover:border-secondary transition-all flex flex-col items-center text-center">
          <div className="bg-secondary/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-6 text-sm">Access your organizer dashboard and manage active hackathons.</p>
          <button 
            onClick={() => navigate("/host-login")}
            className="w-full py-3 border border-secondary text-secondary font-bold rounded-lg hover:bg-secondary hover:text-black transition-all"
          >
            Host Login
          </button>
        </div>
      </div>
    </div>
  );
}