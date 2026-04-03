import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    github: "",
    skills: [],
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState("");
  const [githubData, setGithubData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const fetchGithubSkills = async () => {
    if (!form.github) return setError("Enter a GitHub URL or username");

    try {
      setLoading(true);
      setError("");

      const username = form.github.includes("github.com/")
        ? form.github.split("github.com/")[1].replace(/\//g, "")
        : form.github.trim();

      const res = await fetch(`http://localhost:5000/api/github/${username}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const skills = Object.keys(data.languages || {});
      setGithubData(data);
      setFetched(true);
      setForm((prev) => ({ ...prev, skills, github: `https://github.com/${username}` }));
    } catch (err) {
      console.error(err);
      setError("Could not fetch GitHub profile. Check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.github)
      return setError("All fields are required.");
    if (!fetched) return setError("Please fetch your GitHub skills first.");

    try {
      setSubmitting(true);
      setError("");

      const username = form.github.includes("github.com/")
        ? form.github.split("github.com/")[1].replace(/\//g, "")
        : form.github.trim();

      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          githubId: username,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      if (data.token) localStorage.setItem("token", data.token);

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const skillColors = [
    "bg-sky-500", "bg-violet-500", "bg-emerald-500",
    "bg-amber-500", "bg-rose-500", "bg-indigo-500",
  ];

  return (
    <div className="flex items-center justify-center px-4 pb-16">
      <div className="w-full max-w-[420px]">

        {/* Header — mirrors Login exactly */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] tracking-[4px] uppercase font-primary">
              SkillConnect
            </span>
          </div>
          <h1 className="font-heading text-4xl font-semibold text-white leading-tight mb-2">
            Join the<br />network<span className="text-primary">.</span>
          </h1>
          <p className="text-muted text-xs tracking-wide font-primary">
            Connect your GitHub and find your team
          </p>
        </div>

        {/* Card — same glassmorphism as Login */}
        <div
          className="relative rounded-2xl border border-primary/15 p-8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}
        >
          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(170,255,52,0.4), transparent)" }}
          />

          {/* Error Banner */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg font-primary tracking-wide">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ada Lovelace"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-muted/30 rounded-lg px-4 py-3 text-white text-sm font-primary placeholder-muted/30 outline-none focus:border-primary focus:bg-primary/[0.04] transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="ada@example.com"
                value={form.email}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-muted/30 rounded-lg px-4 py-3 text-white text-sm font-primary placeholder-muted/30 outline-none focus:border-primary focus:bg-primary/[0.04] transition-all duration-200"
              />
            </div>

            {/* GitHub */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                GitHub
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="github"
                  placeholder="github.com/username"
                  value={form.github}
                  onChange={(e) => {
                    setFetched(false);
                    setGithubData(null);
                    handleChange(e);
                  }}
                  className="flex-1 bg-white/[0.03] border border-muted/30 rounded-lg px-4 py-3 text-white text-sm font-primary placeholder-muted/30 outline-none focus:border-primary focus:bg-primary/[0.04] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={fetchGithubSkills}
                  disabled={loading}
                  className="px-4 py-3 bg-primary text-black text-xs font-primary font-bold tracking-[1px] uppercase rounded-lg hover:bg-lime-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(170,255,52,0.3)] active:translate-y-0 transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      ...
                    </span>
                  ) : fetched ? "✓ Done" : "Fetch"}
                </button>
              </div>
            </div>

            {/* GitHub Preview Card */}
            {githubData && (
              <div
                className="rounded-xl p-4 flex items-center gap-4 border border-primary/20"
                style={{ background: "rgba(170,255,52,0.03)" }}
              >
                <img
                  src={githubData.avatar}
                  alt={githubData.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-primary font-semibold truncate">
                    @{githubData.username}
                  </p>
                  <p className="text-muted text-[10px] tracking-wide font-primary mt-0.5">
                    {githubData.reposAnalyzed} repos analysed
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {githubData.roles?.slice(0, 2).map((r, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-primary tracking-wide"
                      >
                        {r.role} · {r.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detected Skills */}
            {form.skills.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
                  Detected Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`${skillColors[i % skillColors.length]} text-white text-[10px] px-3 py-1 rounded-full font-primary font-medium tracking-wide`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit — mirrors Login button exactly */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-primary text-base font-primary font-semibold text-sm tracking-[2px] uppercase rounded-lg py-3.5 hover:bg-lime-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(170,255,52,0.3)] active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating account..." : "Create Account →"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-muted/20" />
            <span className="text-[10px] tracking-[2px] text-muted uppercase font-primary">
              already a member
            </span>
            <div className="flex-1 h-px bg-muted/20" />
          </div>

          {/* Sign in link */}
          <p className="text-center text-xs text-muted font-primary">
            Have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}