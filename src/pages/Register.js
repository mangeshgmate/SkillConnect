import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    if (!form.name || !form.email || !form.password || !form.github) {
      return setError("All fields are required.");
    }
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
          githubId: username   // ✅ FIXED
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ Save token so protected routes work immediately
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

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
    <div className="min-h-screen bg-base flex items-center justify-center font-primary px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading text-white tracking-tight">
            Join the Network
          </h1>
          <p className="text-muted text-sm mt-2">
            Connect your GitHub and find your team
          </p>
        </div>

        <div className="bg-base border border-muted rounded-2xl p-8 shadow-2xl space-y-5">

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs text-muted uppercase tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ada Lovelace"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent border border-muted rounded-lg px-4 py-2.5 text-white placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs text-muted uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="ada@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-muted rounded-lg px-4 py-2.5 text-white placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs text-muted uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent border border-muted rounded-lg px-4 py-2.5 text-white placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-1">
              <label className="text-xs text-muted uppercase tracking-widest">
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
                  className="flex-1 bg-transparent border border-muted rounded-lg px-4 py-2.5 text-white placeholder-muted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={fetchGithubSkills}
                  disabled={loading}
                  className="px-4 py-2.5 bg-primary text-black text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Fetching
                    </span>
                  ) : fetched ? "✓ Fetched" : "Fetch"}
                </button>
              </div>
            </div>

            {/* GitHub Preview Card */}
            {githubData && (
              <div className="border border-muted rounded-xl p-4 flex items-center gap-4 bg-white/5">
                <img
                  src={githubData.avatar}
                  alt={githubData.username}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">@{githubData.username}</p>
                  <p className="text-muted text-xs">{githubData.reposAnalyzed} repos analysed</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {githubData.roles?.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {r.role} · {r.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detected Skills */}
            {form.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted uppercase tracking-widest">
                  Detected Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`${skillColors[i % skillColors.length]} text-white text-xs px-3 py-1 rounded-full font-mono font-medium`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-black py-3 rounded-lg font-heading font-bold text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {submitting ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          <p className="text-center text-muted text-sm pt-2">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}