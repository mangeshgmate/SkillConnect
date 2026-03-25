import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import axios from "axios";

const Explore = () => {
  const [isFilterOpen, openFilter] = useState(false);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 Fetch Users
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

  // 🔥 Toggle Role
  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  // 🔥 Toggle Skill
  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  // 🔥 Apply Filters
  const applyFilters = () => {
    let temp = [...users];

    // Search
    if (search) {
      temp = temp.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Role Filter
    if (selectedRoles.length > 0) {
      temp = temp.filter((user) =>
        user.roles?.some((r) => selectedRoles.includes(r.role))
      );
    }

    // Skills Filter
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

  // 🔥 Reset Filters
  const resetFilters = () => {
    setSelectedRoles([]);
    setSelectedSkills([]);
    setSearch("");
    setFilteredUsers(users);
  };

  return (
    <div className="text-white p-5">
      
      {/* 🔍 Search + Filter */}
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

      {/* 🔽 FILTER PANEL */}
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
                      className={`border px-3 py-1 rounded-full cursor-pointer
                        ${
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

      {/* 🔥 RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {filteredUsers.map((user, index) => (
          <div key={index} className="bg-base p-5 rounded-xl shadow-lg">

            <img
              src={user.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full mb-3"
            />

            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-muted">{user.email}</p>

            <div className="mt-2 text-sm">
              <strong>Skills:</strong>
              <p>
                {[
                  ...(user.skills?.languages || []),
                  ...(user.skills?.frameworks || []),
                ].join(", ")}
              </p>
            </div>

            <div className="mt-2 text-sm">
              <strong>Top Role:</strong>
              <p>{user.roles?.[0]?.role}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Explore;