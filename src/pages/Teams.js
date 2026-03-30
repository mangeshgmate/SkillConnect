import React from 'react'
import { PiX } from 'react-icons/pi';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Discover = () => {
  const { hackathonId } = useParams();
  const [isJoinClicked, clickJoin] = useState(false);
  const handleJoin = () => {
    clickJoin(true);
  }

  const handleCreate = () => {
    clickJoin(false);
  }

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const [teams, setTeams] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/api/teams?hackathonId=${hackathonId}`)
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error(err));
  }, [hackathonId]); // was []

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");      // Login.js saves as "user"
    if (!stored) return;
    const email = JSON.parse(stored).email;           // extract email from the object

    fetch(`http://localhost:5000/api/me?email=${email}`)
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error(err));
  }, []);

  const inferRole = (skills) => {
    if (!skills) return "";

    if (skills.frameworks?.includes("React")) return "Frontend Developer";
    if (skills.frameworks?.includes("Node")) return "Backend Developer";
    if (skills.languages?.includes("Python")) return "ML Engineer";

    return "Developer";
  };

  const [formData, setFormData] = useState({
    teamName: "",
    projectName: "",
    description: "",
    requiredSkills: "",
    maxMembers: "",
    role: "",
  });
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: currentUser.skills?.languages?.join(", ") || "",
        role: inferRole(currentUser.skills),
      }));
    }
  }, [currentUser]);

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

  const filteredUsers = formData.role && roleComplement[formData.role]
    ? users.filter(u => roleComplement[formData.role](u) && u._id !== currentUser?._id)
    : users.filter(u => u._id !== currentUser?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log("hackathonId at submit:", hackathonId);

    if (!currentUser) {
      alert("You must be logged in.");
      return;
    }
    if (!formData.teamName || !formData.role) {
      alert("Team name and role are required.");
      return;
    }

    try {
      // Step 1 — Create the team
      const teamRes = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxMembers: formData.maxMembers || 4,
          hackathonId,
          createdBy: currentUser._id
        })
      });

      const teamData = await teamRes.json();
      console.log("Team response:", teamData); // check in browser console

      if (!teamData.success) {
        alert("Failed to create team: " + teamData.message);
        return;
      }

      // Step 2 — Register user for hackathon
      const regRes = await fetch(`http://localhost:5000/api/hackathons/${hackathonId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser._id })
      });

      const regData = await regRes.json();
      console.log("Registration response:", regData); // check in browser console

      if (regData.success) {
        alert("Team created & registered!");

        // Refresh teams list so it appears in JOIN tab immediately
        const refreshed = await fetch(`http://localhost:5000/api/teams?hackathonId=${hackathonId}`);
        const refreshedData = await refreshed.json();
        setTeams(refreshedData);

        // Clear the form
        setFormData({
          teamName: "",
          projectName: "",
          description: "",
          requiredSkills: currentUser.skills?.languages?.join(", ") || "",
          maxMembers: "",
          role: inferRole(currentUser.skills),
        });
      }

    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Check the console.");
    }
  };

  const handleJoinTeam = async (teamId) => {
    await fetch(`http://localhost:5000/api/teams/${teamId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser._id })
    });
  };


  return (
    <>
      <div className="flex flex-col gap-4 px-4 mt-4 text-sm">
        <div className="flex gap-3">
          <button className="h-9 px-4 bg-primary text-black text-sm font-medium rounded hover:opacity-80"
            onClick={() => handleCreate()}>
            CREATE
          </button>

          <button className="h-9 px-4 bg-primary text-black text-sm font-medium rounded hover:opacity-80"
            onClick={() => handleJoin()}>
            JOIN
          </button>
        </div>

        <hr className="border-muted" />
        {/*Create by default*/}
        {!isJoinClicked ? (
          <div className="flex flex-col md:flex-row gap-6 w-full">

            <div className="details w-[50%] flex justify-center bg-base">
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
                ></textarea>

                <input
                  type="number"
                  placeholder="Max Members"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                  className="w-full p-2 rounded mb-3 bg-base border-b border-muted"
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

            <div className="w-full md:w-1/2 border-l border-muted pl-4">
              <h2 className='text-sm font-medium mb-3 text-gray-300'>NETWORK INVITE</h2>
              {formData.role && (
                <p className="text-xs text-gray-400 mb-2">
                  Showing complementary roles for <span className="text-primary">{formData.role}</span>
                </p>
              )}

              {filteredUsers.length === 0 ? (
                <p className='text-xs text-gray-400'>No matching users found.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center bg-base border border-muted rounded p-2"
                  >
                    {/* Avatar */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full mr-3"
                    />

                    {/* User Info */}
                    <div className="flex flex-col flex-1 text-white">
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-400">@{user.githubId}</p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.skills?.languages?.map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-primary text-black px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}

                        {user.skills?.frameworks?.map((fw, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-500 text-black px-2 py-1 rounded"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Invite Button */}
                    <button className="ml-2 bg-primary btn-small text-black px-3 py-1 rounded font-semibold hover:opacity-80">
                      Invite
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center mt-10 text-white w-full">
            {teams.length === 0 ? (
              <p>No teams available</p>
            ) : (
              teams.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center bg-base border border-muted rounded-lg p-3 w-[90%] max-w-[500px] shadow-md text-white mb-3"
                >

                  {/* Team Icon */}
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black font-bold mr-4">
                    {t.teamName?.charAt(0)}
                  </div>

                  {/* Team Info */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-lg">{t.teamName}</h3>
                    <p className="text-sm text-gray-400">{t.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {t.requiredSkills?.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-surface text-black px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() => handleJoinTeam(t._id)}
                    className="ml-3 bg-primary text-black px-3 py-1 rounded font-semibold"
                  >
                    Join
                  </button>

                </div>
              ))
            )}
          </div>
        )}

      </div >
    </>
  )
}

export default Discover