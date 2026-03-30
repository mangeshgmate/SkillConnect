import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const email = JSON.parse(stored).email;

    fetch(`http://localhost:5000/api/me?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white p-6">Loading profile...</p>;
  if (!user) return <p className="text-white p-6">No user found. Please log in.</p>;

  // rest of your return JSX stays exactly the same

  return (
    <div className="p-6 text-white max-w-6xl mx-auto font-primary">

      {/* 🔥 TOP PROFILE */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-base p-6 rounded-2xl shadow-lg border border-gray-700">

        <img
          src={user.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full border-2 border-primary"
        />

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>

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

      {/* 🔥 SKILLS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>

        <div className="flex flex-wrap gap-3">
          {[...user.skills.languages, ...user.skills.frameworks, ...user.skills.domains].map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-primary/20 border border-primary rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 🔥 TEAMS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Teams</h2>

        {user.teams?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {user.teams.map((team, i) => (
              <div key={i} className="flex justify-between p-3 border border-gray-600 rounded-lg">
                <span>{typeof team === "object" ? team.name : team}</span>
                <span className="text-sm text-green-400">
                  {typeof team === "object" ? team.status : "Member"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No teams joined yet</p>
        )}
      </div>

      {/* 🔥 PROJECTS */}
      <div className="mt-6 bg-base p-6 rounded-2xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Hackathon Projects</h2>

        <div className="grid md:grid-cols-2 gap-4">
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

    </div>
  );
};

export default Profile;