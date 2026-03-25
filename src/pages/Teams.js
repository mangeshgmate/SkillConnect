import React from 'react'
import { PiX } from 'react-icons/pi';
import { useState, useEffect } from 'react';
const Discover = () => {
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
    fetch("http://localhost:5000/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="h-screen font-primary">

        <button className="h-[50px] w-[120px] m-[2px] bg-primary flex-1 p-[10px]  border-none font-bold cursor-pointer mb-[20px] ml-[40px] text-black"
          onClick={() => handleCreate()}>
          CREATE
        </button>

        <button className="h-[50px] w-[120px] m-[2px] bg-primary flex-1 p-[10px]  border-none font-bold cursor-pointer mb-[20px] ml-[40px] text-black"
          onClick={() => handleJoin()}>
          JOIN
        </button>

        <hr />
        {/*Create by default*/}
        {!isJoinClicked ? (
          <div className="mt-[20px] h-[600px] w-full flex justify-center">

            <div className="details w-[50%] flex justify-center bg-base">
              <form className="w-full max-w-3xl p-6 rounded-lg text-white">

                <input
                  type="text"
                  placeholder="Team Name"
                  className="w-full p-3 rounded mb-4 bg-base border-b-2 border-b-muted"
                />

                <input
                  type="text"
                  placeholder="Project Name"
                  className="w-full p-3 rounded mb-4 bg-base border-b-2 border-b-muted"
                />

                <textarea
                  placeholder="Description"
                  rows="4"
                  className="w-full p-3 rounded mb-4 bg-base border-2 border-muted"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-base text-white p-3 rounded border border-primary"
                >
                  Create
                </button>

              </form>
            </div>

            <div className="invite flex flex-col items-center border-l border-l-muted w-[50%] text-white">
              <div>NETWORK INVITE</div>

              <div className="Connections_display flex flex-col gap-3 mt-4">
                {users.length === 0 ? (
                  <p>Loading users...</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center bg-base border border-muted rounded-lg p-3 w-[100%] max-w-[500px] shadow-md"
                    >
                      {/* Avatar */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover mr-4"
                      />

                      {/* User Info */}
                      <div className="flex flex-col flex-1 text-white">
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-sm text-gray-400">@{user.githubId}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-2">
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
                      <button className="ml-3 bg-primary text-black px-3 py-1 rounded font-semibold hover:opacity-80">
                        Invite
                      </button>
                    </div>
                  ))
                )}
              </div>

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
                  <button className="ml-3 bg-primary text-black px-3 py-1 rounded font-semibold">
                    Join
                  </button>

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </>
  )
}

export default Discover