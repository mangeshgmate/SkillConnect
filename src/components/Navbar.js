import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiBell } from "react-icons/fi";
import { useState, useEffect } from 'react';
import axios from "axios";

export default function Navbar() {

  const [isOpen, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔔 Notification states
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  // 🔥 Get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "My Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
    { name: "Logout", path: "/login" }
  ];

  // 🔥 Fetch notifications on login
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/${user._id}`
        );
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <>
      <nav className="p-4 text-white flex items-center justify-between w-full relative">

        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold">
          SkillConnect
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-primary">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/team">CREATE | JOIN TEAM</Link></li>
          <li><Link to="/explore">EXPLORE</Link></li>
          <li><Link to="/explore-hackathons">HACKATHONS</Link></li>
          <li><Link to="/host">HOST</Link></li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* 🔔 Notification Bell (ONLY if logged in) */}
          {user && (
            <div className="relative">

              <FiBell
                onClick={() => setNotifOpen(!notifOpen)}
                className="cursor-pointer text-2xl hover:text-primary"
              />

              {/* 🔴 Notification Count */}
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
                  {notifications.length}
                </span>
              )}

              {/* 🔽 Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-base border border-primary p-4 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">

                  <h3 className="text-sm font-semibold mb-3 text-primary">
                    Notifications
                  </h3>

                  {notifications.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n, i) => (
                      <div
                        key={i}
                        className="p-2 border-b border-muted text-sm hover:bg-secondary cursor-pointer"
                      >
                        {n.message}
                      </div>
                    ))
                  )}

                </div>
              )}
            </div>
          )}

          {/* Profile Icon */}
          {user && (
            <FiUser
              onClick={() => setOpen(!isOpen)}
              className="cursor-pointer border-2 border-primary rounded-full size-8 p-1"
            />
          )}

          {/* Hamburger Menu (Mobile Only) */}
          <div className="md:hidden">
            {menuOpen ? (
              <FiX size={24} onClick={() => setMenuOpen(false)} />
            ) : (
              <FiMenu size={24} onClick={() => setMenuOpen(true)} />
            )}
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-base text-white p-4 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link to="/team" onClick={() => setMenuOpen(false)}>CREATE | JOIN TEAM</Link>
          <Link to="/explore" onClick={() => setMenuOpen(false)}>EXPLORE</Link>
          <Link to="/host" onClick={() => setMenuOpen(false)}>HOST</Link>
        </div>
      )}

      {/* Profile Dropdown */}
      {isOpen && user && (
        <div className="absolute right-4 top-[70px] w-48 p-2 shadow-lg border border-muted text-white bg-base font-primary z-50 rounded-lg">
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:text-primary hover:bg-secondary cursor-pointer transition duration-200 rounded"
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}