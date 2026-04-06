import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiBell } from "react-icons/fi";
import { FiCheck, FiXCircle } from "react-icons/fi";
import { useState, useEffect } from 'react';
import axios from "axios";

export default function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  
  const menuItems = [
    { name: "My Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
    { name: "Logout", path: "/login", action: "logout" }  // ← tag logout
  ];

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const userId = typeof user._id === "object"
        ? (user._id.$oid || user._id.toString())
        : user._id;

      const res = await axios.get(
        `http://localhost:5000/api/notifications/${userId}`
      );
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedHost = JSON.parse(localStorage.getItem("hostUser"));
      // You can store them in one state or separate ones. 
    // Let's create a combined 'isLoggedIn' check.
    setUser(storedUser || storedHost);
    };

    // Run once on mount
    syncUser();

    // Listen for changes (other tabs / manual updates)
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // Fetch immediately + poll every 15s
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]); // ← depend on user so it restarts after login

  const handleRespond = async (requestId, notificationId, action) => {
    try {
      const res = await fetch("http://localhost:5000/api/request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.toString(),
          notificationId: notificationId.toString(),
          action
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev =>
          prev.filter(n => n._id.toString() !== notificationId.toString())
        );
      }
    } catch (err) {
      console.error("Respond error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setNotifications([]);
    setOpen(false);
    navigate("/login");
  };

  const handleMenuItemClick = (item) => {
    if (item.action === "logout") {
      handleLogout();
    } else {
      navigate(item.path);
      setOpen(false);
    }
  };

  return (
    <>
      <nav className="p-4 text-white flex items-center justify-between w-full relative">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-heading">
          SkillConnect
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-primary text-sm">
          <li><Link to="/" className="hover:text-primary transition">HOME</Link></li>
          <li><Link to="/explore" className="hover:text-primary transition">Connect</Link></li>
          <li><Link to="/explore-hackathons" className="hover:text-primary transition">HACKATHONS</Link></li>
          {!user && (
          <>
          <li><Link to="/login" className="hover:text-primary transition">Login</Link></li>
          <li><Link to="/host" className="hover:text-primary transition">Host</Link></li>
          </>
          )}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Notification Bell — only when logged in */}
          {user && (
            <div className="relative">
              <FiBell
                onClick={() => setNotifOpen(!notifOpen)}
                className="cursor-pointer text-2xl hover:text-primary transition"
              />

              {/* Badge — only when there are pending notifications */}
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                  {notifications.length}
                </span>
              )}

              {/* Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-base border border-primary/30 rounded-xl shadow-2xl z-50 overflow-hidden">

                  <div className="flex items-center justify-between px-4 py-3 border-b border-muted/20">
                    <h3 className="text-xs font-semibold tracking-widest text-primary uppercase font-primary">
                      Notifications
                    </h3>
                    <span className="text-[10px] text-muted font-primary">
                      {notifications.length} pending
                    </span>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <FiBell className="text-muted text-2xl" />
                        <p className="text-muted text-xs font-primary">
                          No pending requests
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className="px-4 py-3 border-b border-muted/10 hover:bg-white/[0.02] transition"
                        >
                          <p className="text-sm text-white mb-2 font-primary leading-snug">
                            {n.message}
                          </p>

                          {n.type === "connection_request" && n.requestId && (
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleRespond(n.requestId, n._id, "accept")}
                                className="flex items-center gap-1 bg-primary text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-lime-300 transition font-primary"
                              >
                                <FiCheck size={12} /> Accept
                              </button>
                              <button
                                onClick={() => handleRespond(n.requestId, n._id, "reject")}
                                className="flex items-center gap-1 bg-white/5 border border-muted/30 text-muted text-xs px-3 py-1.5 rounded-lg hover:border-red-400 hover:text-red-400 transition font-primary"
                              >
                                <FiXCircle size={12} /> Decline
                              </button>
                            </div>
                          )}

                          <p className="text-[10px] text-muted/50 mt-2 font-primary">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Icon — only when logged in */}
          {user && (
            <FiUser
              onClick={() => setOpen(!isOpen)}
              className="cursor-pointer border-2 border-primary rounded-full size-8 p-1 hover:bg-primary hover:text-base transition"
            />
          )}

          {/* Login button — only when NOT logged in */}
          {!user && (
            <Link
              to="/login"
              className="text-xs px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-80 font-primary"
            >
              Login
            </Link>
          )}

          {/* Hamburger */}
          <div className="md:hidden">
            {menuOpen
              ? <FiX size={24} onClick={() => setMenuOpen(false)} />
              : <FiMenu size={24} onClick={() => setMenuOpen(true)} />
            }
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-base text-white p-4 flex flex-col gap-4 font-primary text-sm border-b border-muted/20">
          <Link to="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link to="/explore" onClick={() => setMenuOpen(false)}>Connect</Link>
          <Link to="/explore-hackathons" onClick={() => setMenuOpen(false)}>HACKATHONS</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/host" onClick={() => setMenuOpen(false)}>host</Link>
        </div>
      )}

      {/* Profile Dropdown */}
      {isOpen && user && (
        <div className="absolute right-4 top-[70px] w-48 p-2 shadow-lg border border-muted/20 text-white bg-base font-primary z-50 rounded-xl">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="rounded overflow-hidden">
                <button
                  onClick={() => handleMenuItemClick(item)}
                  className="w-full text-left block p-2 text-sm hover:text-primary hover:bg-secondary transition duration-200 rounded"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
