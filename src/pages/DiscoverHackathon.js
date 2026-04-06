import React from 'react';

export default function DiscoverHackathon() {
  const hackathons = [
    { id: 1, title: "Smart City Hackathon", date: "April 20, 2026", location: "Pune" },
    { id: 2, title: "FinTech 2.0", date: "May 15, 2026", location: "Mumbai" },
    { id: 3, title: "SkillConnect Innovate", date: "June 05, 2026", location: "Hinjewadi" }
  ];

  return (
    <div className="p-10 text-white bg-base min-h-screen">
      <h1 className="text-4xl font-bold text-primary mb-8">Discover Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hack) => (
          <div key={hack.id} className="p-6 border border-primary/20 bg-white/5 rounded-2xl hover:border-primary transition-all">
            <h2 className="text-2xl font-semibold mb-2">{hack.title}</h2>
            <p className="text-gray-400">📅 {hack.date}</p>
            <p className="text-gray-400">📍 {hack.location}</p>
            <button className="mt-4 bg-primary text-black px-4 py-2 rounded-lg font-bold">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}