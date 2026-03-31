import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import axios from "axios";
import UserModal from '../components/UserModal';

const Explore = () => {
  const [isFilterOpen, openFilter] = useState(false);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Get logged in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Toggle Role
  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  // Toggle Skill
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  // Apply Filters
  const applyFilters = () => {
    let temp = [...users];

    if (search) {
      temp = temp.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedRoles.length > 0) {
      temp = temp.filter((user) =>
        user.roles?.some((r) => selectedRoles.includes(r.role))
      );
    }

    if (selectedSkills.length > 0) {
      temp = temp.filter((user) =>
        [
          ...(user.skills?.languages || []),
          ...(user.skills?.frameworks || []),
          ...(user.skills?.domains || []),
        ].some((skill) => selectedSkills.includes(skill))
      );
    }

    setFilteredUsers(temp);
  };

  // Reset Filters
  const resetFilters = () => {
    setSelectedRoles([]);
    setSelectedSkills([]);
    setSearch("");
    setFilteredUsers(users);
  };

  const handleUserProfile = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users?email=${email}`
      );
      setSelectedUser(res.data);
      setIsUserModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (toUserId, toUserName) => {
    try {
      if (!currentUser) {
        alert("You must be logged in to connect.");
        return;
      }

      // Fetch full current user to get name and _id
      const meRes = await axios.get(
        `http://localhost:5000/api/me?email=${currentUser.email}`
      );
      const me = meRes.data;

      await axios.post("http://localhost:5000/api/request/send", {
        fromUserId: me._id.toString(),
        fromUserName: me.name,
        toUserId: toUserId.toString(),
      });

      alert(`Connection request sent to ${toUserName} 🚀`);
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    }
  };

  return (
    <div className="text-white p-5">

      {/* Search + Filter */}
      <div className="flex w-full items-center justify-center gap-5">
        <div className="bg-base w-[50%]">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-base w-full p-4 rounded-3xl border-2 border-primary"
          />
        </div>

        <CiFilter
          className="text-4xl cursor-pointer hover:text-primary"
          onClick={() => openFilter(!isFilterOpen)}
        />
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="absolute border-2 border-muted bg-base w-full z-50 mt-4 p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Roles */}
            <div>
              <h3 className="font-semibold mb-3">Role</h3>
              {[
                "Frontend Developer",
                "Backend Developer",
                "ML/AI Engineer",
                "UI/UX Designer",
              ].map((role) => (
                <label key={role} className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  {role}
                </label>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "Python", "Flask", "Docker"].map(
                  (skill) => (
                    <span
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`border px-3 py-1 rounded-full cursor-pointer ${
                        selectedSkills.includes(skill)
                          ? "bg-primary text-black"
                          : ""
                      }`}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={resetFilters}
              className="px-5 py-2 border border-muted"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-5 py-2 bg-primary text-black font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-base to-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-14 h-14 rounded-full border-2 border-primary"
              />
              <div>
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-3">
              <p className="text-sm font-semibold text-primary mb-1">Skills</p>
              <div className="flex flex-wrap gap-2">
                {[
                  ...(user.skills?.languages || []),
                  ...(user.skills?.frameworks || []),
                ].slice(0, 6).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-[#2b2b2b] text-white border border-[#3a3a3a]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Role */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-primary">Top Role</p>
              <p className="text-white text-sm mt-1">
                {user.roles?.[0]?.role || "Not analyzed"}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs text-gray-400">🚀 Ready for Hackathon</span>

              <button
                onClick={() => handleUserProfile(user.email)}
                className="text-xs px-3 py-1 rounded-full bg-primary text-black font-semibold hover:opacity-80"
              >
                View Profile
              </button>

              {/* Connect Button */}
              <button
                onClick={() => sendRequest(user._id, user.name)}
                className="text-xs px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary hover:text-black transition"
              >
                Connect
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* User Modal — moved outside the map */}
      {isUserModalOpen && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsUserModalOpen(false)}
        />
      )}

    </div>
  );
};

export default Explore;