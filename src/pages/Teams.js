import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Discover = () => {
  const { hackathonId } = useParams();
  const [isJoinClicked, clickJoin] = useState(false);
  const [inviteTab, setInviteTab] = useState("network"); // "network" | "all"

  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [hackathonData, setHackathonData] = useState(null);

  const [formData, setFormData] = useState({
    teamName: "",
    projectName: "",
    description: "",
    requiredSkills: "",
    maxMembers: "",
    role: "",
  });

  const inferRole = (skills) => {
    if (!skills) return "";
    if (skills.frameworks?.includes("React")) return "Frontend Developer";
    if (skills.frameworks?.includes("Node")) return "Backend Developer";
    if (skills.languages?.includes("Python")) return "ML Engineer";
    return "Developer";
  };

  // Fetch current user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const email = JSON.parse(stored).email;

    fetch(`http://localhost:5000/api/me?email=${email}`)
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch connections once we have the current user
  useEffect(() => {
    if (!currentUser) return;
    const userId = (currentUser._id?.$oid || currentUser._id)?.toString();

    fetch(`http://localhost:5000/api/connections/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setConnections(data.data);
      })
      .catch(err => console.error(err));
  }, [currentUser]);

  // Fetch teams
  useEffect(() => {
    fetch(`http://localhost:5000/api/teams?hackathonId=${hackathonId}`)
      .then(res => res.json())
      .then(data => setTeams(data))
      .catch(err => console.error(err));
  }, [hackathonId]);

  // Fetch hackathon data
  useEffect(() => {
    if (!hackathonId) return;
    fetch(`http://localhost:5000/api/hackathons/${hackathonId}`)
      .then(res => res.json())
      .then(data => setHackathonData(data.data))
      .catch(err => console.error(err));
  }, [hackathonId]);

  // Pre-fill form from user + hackathon
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: currentUser.skills?.languages?.join(", ") || "",
        role: inferRole(currentUser.skills),
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (hackathonData) {
      setFormData(prev => ({
        ...prev,
        maxMembers: hackathonData.maxTeamSize || 4,
      }));
    }
  }, [hackathonData]);

  const roleComplement = {
    "Frontend Developer": (user) =>
      user.skills?.frameworks?.some(f => ["Node", "Express", "Django"].includes(f)) ||
      user.skills?.languages?.includes("Python"),
    "Backend Developer": (user) =>
      user.skills?.frameworks?.some(f => ["React", "Vue", "Angular"].includes(f)),
    "ML Engineer": (user) =>
      user.skills?.frameworks?.some(f => ["React", "Vue"].includes(f)) ||
      user.skills?.languages?.some(l => ["JavaScript", "TypeScript"].includes(l)),
    "Designer": (user) =>
      user.skills?.languages?.some(l => ["JavaScript", "Python"].includes(l)),
  };

  const myId = (currentUser?._id?.$oid || currentUser?._id)?.toString();

  // Pool of users depending on active tab
  const basePool = inviteTab === "network"
    ? connections
    : users.filter(u => (u._id?.$oid || u._id)?.toString() !== myId);

  // Apply role complement filter on top
  const filteredUsers = formData.role && roleComplement[formData.role]
    ? basePool.filter(u => roleComplement[formData.role](u))
    : basePool;

  const sendInvite = async (user) => {
    if (!currentUser) return;
    await fetch("http://localhost:5000/api/request/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromUserId: myId,
        fromUserName: currentUser.name,
        toUserId: (user._id?.$oid || user._id)?.toString(),
      })
    });
    alert(`Invite sent to ${user.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in.");
    if (!formData.teamName || !formData.role) return alert("Team name and role are required.");

    try {
      const teamRes = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxMembers: formData.maxMembers || 4,
          hackathonId,
          createdBy: myId,
        })
      });
      const teamData = await teamRes.json();
      if (!teamData.success) return alert("Failed to create team: " + teamData.message);

      const regRes = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: myId })
      });
      const regData = await regRes.json();

      if (regData.success) {
        alert("Team created & registered!");
        const refreshed = await fetch(`http://localhost:5000/api/teams?hackathonId=${hackathonId}`);
        setTeams(await refreshed.json());
        setFormData(prev => ({
          ...prev,
          teamName: "",
          projectName: "",
          description: "",
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const handleJoinTeam = async (teamId) => {
    await fetch(`http://localhost:5000/api/teams/${teamId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: myId })
    });
  };

  if (!hackathonId) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-white gap-3">
        <p className="text-gray-400 text-sm">You must register for a hackathon before creating or joining a team.</p>
        <a href="/explore-hackathons" className="bg-primary text-black px-4 py-2 rounded font-semibold hover:opacity-80">
          Browse Hackathons
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 mt-4 text-sm">

      {/* CREATE / JOIN tabs */}
      <div className="flex gap-3">
        <button
          className={`h-9 px-4 text-sm font-medium rounded hover:opacity-80 ${!isJoinClicked ? "bg-primary text-black" : "border border-primary text-primary"}`}
          onClick={() => clickJoin(false)}
        >
          CREATE
        </button>
        <button
          className={`h-9 px-4 text-sm font-medium rounded hover:opacity-80 ${isJoinClicked ? "bg-primary text-black" : "border border-primary text-primary"}`}
          onClick={() => clickJoin(true)}
        >
          JOIN
        </button>
      </div>

      <hr className="border-muted" />

      {!isJoinClicked ? (
        <div className="flex flex-col md:flex-row gap-6 w-full">

          {/* Form */}
          <div className="w-full md:w-1/2 flex justify-center bg-base">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl p-4 rounded-lg text-white text-sm">
              <input
                type="text"
                placeholder="Team Name"
                value={formData.teamName}
                onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                className="w-full p-2 rounded mb-3 bg-base border-b border-muted"
              />
              <input
                type="text"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                className="w-full p-2 rounded mb-3 bg-base border-b border-muted"
              />
              <textarea
                placeholder="Project Description"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 rounded mb-3 bg-base border-b border-muted"
              />
              <input
                type="number"
                value={formData.maxMembers}
                readOnly
                className="w-full p-2 rounded mb-3 bg-base border-b border-muted opacity-60 cursor-not-allowed"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full p-2 rounded mb-3 bg-base border-b border-muted"
              >
                <option value="">Select Your Role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="Designer">Designer</option>
              </select>
              <button
                type="submit"
                className="w-full bg-base text-white p-3 rounded border border-primary hover:scale-105 transition-transform duration-200"
              >
                Create Team & Register
              </button>
            </form>
          </div>

          {/* Invite Panel */}
          <div className="w-full md:w-1/2 border-l border-muted pl-4">

            {/* Network / All toggle */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-300">INVITE TEAMMATES</h2>
              <div className="flex rounded overflow-hidden border border-muted text-xs">
                <button
                  onClick={() => setInviteTab("network")}
                  className={`px-3 py-1 transition-colors ${inviteTab === "network" ? "bg-primary text-black font-semibold" : "text-gray-400 hover:text-white"}`}
                >
                  My Network
                  {connections.length > 0 && (
                    <span className="ml-1 bg-black/20 px-1 rounded-full">{connections.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setInviteTab("all")}
                  className={`px-3 py-1 transition-colors ${inviteTab === "all" ? "bg-primary text-black font-semibold" : "text-gray-400 hover:text-white"}`}
                >
                  All Users
                </button>
              </div>
            </div>

            {formData.role && (
              <p className="text-xs text-gray-400 mb-2">
                Filtered for roles that complement <span className="text-primary">{formData.role}</span>
              </p>
            )}

            {/* Empty states */}
            {inviteTab === "network" && connections.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                <p>You have no connections yet.</p>
                <a href="/explore" className="text-primary hover:underline mt-1 inline-block">
                  Explore users to connect →
                </a>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-xs text-gray-400">No matching users found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center bg-base border border-muted rounded p-2"
                  >
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full mr-3" />
                    <div className="flex flex-col flex-1 text-white">
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-400">@{user.githubId}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.skills?.languages?.map((skill, i) => (
                          <span key={i} className="text-xs bg-primary text-black px-2 py-0.5 rounded">{skill}</span>
                        ))}
                        {user.skills?.frameworks?.map((fw, i) => (
                          <span key={i} className="text-xs bg-green-500 text-black px-2 py-0.5 rounded">{fw}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      disabled={!currentUser}
                      onClick={() => sendInvite(user)}
                      className="ml-2 bg-primary text-black px-3 py-1 rounded font-semibold hover:opacity-80 disabled:opacity-40 text-xs"
                    >
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      ) : (
        /* JOIN tab */
        <div className="flex flex-col items-center mt-10 text-white w-full">
          {teams.length === 0 ? (
            <p>No teams available</p>
          ) : (
            teams.map((t) => {
              const spotsLeft = t.maxMembers - (t.members?.length || 1);
              return (
                <div
                  key={t._id}
                  className="flex items-center bg-base border border-muted rounded-lg p-3 w-[90%] max-w-[500px] shadow-md text-white mb-3"
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black font-bold mr-4 shrink-0">
                    {t.teamName?.charAt(0)}
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{t.teamName}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${spotsLeft > 0 ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>
                        {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? "s" : ""} left` : "Full"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{t.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.members?.length || 1} / {t.maxMembers} members</p>
                    {t.requiredSkills?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {t.requiredSkills.map((tech, i) => (
                            <span key={i} className="text-xs bg-primary text-black px-2 py-1 rounded font-medium">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleJoinTeam(t._id)}
                    disabled={spotsLeft <= 0}
                    className="ml-3 bg-primary text-black px-3 py-1 rounded font-semibold disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    Join
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Discover;