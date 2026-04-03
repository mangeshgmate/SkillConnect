import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginData, setLoginData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoginData(data);
        setLoading(false);
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("storage"));
          setIsLogin(true);
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (isLogin) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        Navigate("/");
      }, 2000);
    }
  }, [isLogin]);

  return (
    <>
      {/* Login content sits inside Layout's <children> slot */}
      <div className="flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-[10px] tracking-[4px] uppercase font-primary">
                SkillConnect
              </span>
            </div>
            <h1 className="font-heading text-4xl font-semibold text-white leading-tight mb-2">
              Welcome<br />back<span className="text-primary">.</span>
            </h1>
            <p className="text-muted text-xs tracking-wide font-primary">
              Sign in to continue your journey
            </p>
          </div>

          {/* Card */}
          <div
            className="relative rounded-2xl border border-primary/15 p-8 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}
          >
            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(170,255,52,0.4), transparent)" }}
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-muted/30 rounded-lg px-4 py-3 text-white text-sm font-primary placeholder-muted/30 outline-none focus:border-primary focus:bg-primary/[0.04] transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-muted/30 rounded-lg px-4 py-3 text-white text-sm font-primary placeholder-muted/30 outline-none focus:border-primary focus:bg-primary/[0.04] transition-all duration-200"
                />
              </div>

              {/* Error message */}
              {loginData && !loginData.success && (
                <p className="text-red-400 text-xs font-primary tracking-wide">
                  ✗ Invalid email or password
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-primary text-base font-primary font-semibold text-sm tracking-[2px] uppercase rounded-lg py-3.5 hover:bg-lime-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(170,255,52,0.3)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Login →"}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-muted/20" />
              <span className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                or continue with
              </span>
              <div className="flex-1 h-px bg-muted/20" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { icon: <FaGithub />, label: "GitHub" },
                { icon: <FaGoogle />, label: "Google" },
                { icon: <FaLinkedin />, label: "LinkedIn" },
                { icon: <FaFacebook />, label: "Facebook" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="flex items-center justify-center p-3 rounded-lg border border-muted/20 bg-white/[0.03] text-muted text-lg hover:border-primary hover:text-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Register link */}
            <p className="text-center text-xs text-muted font-primary">
              No account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="border border-primary/40 bg-base rounded-xl px-8 py-6 font-primary text-center"
            style={{ boxShadow: "0 0 40px rgba(170,255,52,0.15)" }}
          >
            <div className="text-primary text-3xl mb-3">✓</div>
            <h2 className="text-white text-sm tracking-widest uppercase">Login Successful</h2>
            <p className="text-muted text-xs mt-1">Redirecting you now...</p>
          </div>
        </div>
      )}
    </>
  );
}