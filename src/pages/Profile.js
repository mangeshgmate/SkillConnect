<<<<<<< HEAD
import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const { email, _id } = JSON.parse(stored);

    fetch(`http://localhost:5000/api/me?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);

        const userId = (data._id?.$oid || data._id || _id)?.toString();

        // Fetch teams
        fetch(`http://localhost:5000/api/teams`)
          .then(res => res.json())
          .then(allTeams => {
            setTeams(allTeams.filter(team =>
              team.members?.includes(userId) || team.createdBy === userId
            ));
          });

        // Fetch connections
        fetch(`http://localhost:5000/api/connections/${userId}`)
          .then(res => res.json())
          .then(result => {
            if (result.success) setConnections(result.data);
          });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white p-6">Loading profile...</p>;
  if (!user) return <p className="text-white p-6">No user found. Please log in.</p>;

  return (
    <div className="p-6 text-white max-w-6xl mx-auto font-primary">

      {/* TOP PROFILE */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-base p-6 rounded-2xl shadow-lg border border-gray-700">
        <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-primary" />
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>
          {/* Connection count like LinkedIn */}
          <p className="text-sm text-primary mt-1 font-medium">
            {connections.length} connection{connections.length !== 1 ? "s" : ""}
          </p>
          <a
            href={`https://github.com/${user.githubId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            GitHub: {user.githubId}
          </a>
        </div>
      </div>

      {/* SKILLS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {[...user.skills.languages, ...user.skills.frameworks, ...user.skills.domains].map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-primary/20 border border-primary rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* CONNECTIONS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          Connections
          <span className="ml-2 text-sm text-gray-400 font-normal">({connections.length})</span>
        </h2>

        {connections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {connections.map((conn, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-600 rounded-xl hover:border-primary transition">
                <img
                  src={conn.avatar}
                  alt={conn.name}
                  className="w-12 h-12 rounded-full border border-gray-500 object-cover"
                />
                <div className="overflow-hidden">
                  <p className="font-semibold truncate">{conn.name}</p>
                  <p className="text-xs text-gray-400 truncate">{conn.email}</p>
                  {conn.roles?.[0] && (
                    <p className="text-xs text-primary mt-0.5 truncate">{conn.roles[0].role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No connections yet</p>
        )}
      </div>

      {/* TEAMS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Teams</h2>

        {teams.length > 0 ? (
          <div className="flex flex-col gap-3">
            {teams.map((team, i) => {
              const userId = (user._id?.$oid || user._id)?.toString();
              const isCreator = team.createdBy === userId;
              return (
                <div key={i} className="p-3 border border-gray-600 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{team.teamName}</p>
                      <p className="text-sm text-gray-400">{team.projectName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${isCreator ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500" : "bg-green-500/20 text-green-400 border border-green-500"}`}>
                        {isCreator ? "Creator" : "Member"}
                      </span>
                      <span className="text-xs text-gray-500">{team.members?.length}/{team.maxMembers} members</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">Not part of any team yet</p>
        )}
      </div>

      {/* PROJECTS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Hackathon Projects</h2>
        {user.projects?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {user.projects.map((project, i) => (
              <div key={i} className="p-4 border border-gray-600 rounded-xl hover:border-primary transition">
                <h3 className="text-lg font-semibold text-primary">{project.title}</h3>
                <p className="text-sm text-gray-400">{project.hackathon}</p>
                <p className="text-sm mt-2">{project.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No projects yet</p>
        )}
      </div>

    </div>
  );
};

export default Profile;
=======
import React from 'react'

const Profile = () => {
  return (
    <div>
      <h1>
            This is profile page
        </h1>
    </div>
  )
}

export default Profile
>>>>>>> a51493c67f89740527f8b6f582e697742321a478
