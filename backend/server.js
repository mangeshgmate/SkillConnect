import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// -----------------------------
// MongoDB Connection
// -----------------------------
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let usersCollection;
let hackathonsCollection;
let teamsCollection;
let requestsCollection;
let notificationsCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("hackathonDB");

    usersCollection = db.collection("users");
    hackathonsCollection = db.collection("hackathons");
    teamsCollection = db.collection("teams");
    requestsCollection = db.collection("requests");
    notificationsCollection = db.collection("notifications");

    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

// -----------------------------
// Role Mapping Logic
// -----------------------------
const roleMap = {
  "Frontend Developer": ["javascript", "html", "css", "typescript"],
  "Backend Developer": ["python", "java", "node", "go", "php"],
  "ML/AI Engineer": ["python"],
  "UI/UX Designer": ["html", "css"]
};

function mapRoles(weighted) {
  const roleScores = {};

  for (const role in roleMap) {
    roleScores[role] = 0;
  }

  for (const lang in weighted) {
    const lower = lang.toLowerCase();

    for (const role in roleMap) {
      if (roleMap[role].includes(lower)) {
        roleScores[role] += weighted[lang];
      }
    }
  }

  const total =
    Object.values(roleScores).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(roleScores)
    .map(([role, score]) => ({
      role,
      percentage: ((score / total) * 100).toFixed(1)
    }))
    .filter((r) => r.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);
}

// -----------------------------
// GitHub Helpers
// -----------------------------
function extractUsername(input) {
  if (input.includes("github.com")) {
    return input.split("github.com/")[1].replace("/", "");
  }
  return input;
}

async function analyzeGithub(username) {
  try {
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    };

    console.log("🔍 Fetching repos for:", username);

    const reposRes = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      { headers }
    );

    const repos = reposRes.data;
    const languageStats = {};

    for (const repo of repos) {
      if (!repo.languages_url) continue;

      const langRes = await axios.get(repo.languages_url, {
        headers
      });

      const langs = langRes.data;

      for (const lang in langs) {
        if (!languageStats[lang]) {
          languageStats[lang] = 0;
        }
        languageStats[lang] += langs[lang];
      }
    }

    return languageStats;
  } catch (error) {
    console.error("❌ GitHub API Error:", error.message);
    throw error;
  }
}

// -----------------------------
// Routes
// -----------------------------
// Get hackathon by ID
app.get("/api/hackathons/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const hackathon = await hackathonsCollection.findOne({
      _id: new ObjectId(id)
    });

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    res.json({
      success: true,
      data: hackathon
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, githubId } = req.body;

    // Validation
    if (!name || !email || !password || !githubId) {
      return res.status(400).json({
        success: false,
        message: "All fields including GitHub ID are required"
      });
    }

    // Check existing user
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // -----------------------------
    // 🔍 Fetch GitHub Profile
    // -----------------------------
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    };

    const profileRes = await axios.get(
      `https://api.github.com/users/${githubId}`,
      { headers }
    );

    const avatar = profileRes.data.avatar_url;

    // -----------------------------
    // 📊 Analyze GitHub
    // -----------------------------
    const languages = await analyzeGithub(githubId);
    const roles = mapRoles(languages);

    // -----------------------------
    // 🧠 Extract Skills (Basic Logic)
    // -----------------------------
    const skills = {
      languages: Object.keys(languages),
      frameworks: [],
      domains: []
    };

    // Simple framework detection
    const frameworkMap = {
      "React": "frontend",
      "Node.js": "backend",
      "Express": "backend",
      "Django": "backend",
      "Flask": "backend"
    };

    skills.frameworks = Object.keys(frameworkMap).filter(f =>
      Object.keys(languages).some(lang =>
        lang.toLowerCase().includes(f.toLowerCase())
      )
    );

    // Domains (basic mapping)
    if (languages["Python"]) {
      skills.domains.push("AI", "Data Science");
    }
    if (languages["JavaScript"]) {
      skills.domains.push("Web Development", "Frontend");
    }

    // -----------------------------
    // 🔢 Repo Count
    // -----------------------------
    const reposRes = await axios.get(
      `https://api.github.com/users/${githubId}/repos`,
      { headers }
    );

    const reposAnalyzed = reposRes.data.length;

    // -----------------------------
    // 🔐 Hash Password
    // -----------------------------
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.default.hash(password, 10);

    // -----------------------------
    // 💾 Final User Object
    // -----------------------------
    const newUser = {
      name,
      email,
      password: hashedPassword,
      githubId,
      avatar,

      skills,
      roles,
      languages,

      reposAnalyzed,
      teams: [],

      createdAt: new Date()
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser
    });

  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await usersCollection.findOne({ email, password });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id.toString(),   // ← THIS is the fix
          name: user.name,
          email: user.email
        }
      });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GitHub Analysis
app.get("/api/github/:username", async (req, res) => {
  try {
    const raw = req.params.username;
    const username = extractUsername(raw);

    const weighted = await analyzeGithub(username);
    const roles = mapRoles(weighted);

    res.json({
      success: true,
      username,
      roles,
      languages: weighted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "GitHub fetch error"
    });
  }
});

// Hackathons
app.get("/api/hackathons", async (req, res) => {
  try {
    const hackathons = await hackathonsCollection.find().toArray();

    res.json({
      success: true,
      data: hackathons
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Promotional Hackathons
app.get("/promotionalHackathons", async (req, res) => {
  const data = await hackathonsCollection.find({}).toArray();
  res.json(data);
});

// Users
app.get("/api/users", async (req, res) => {
  try {
    const email = req.query.email;

    // --------------------------
    // CASE 1: GET ALL USERS
    // --------------------------
    if (!email) {
      const users = await usersCollection.find({}).toArray();
      return res.json(users);
    }

    // --------------------------
    // CASE 2: GET USER BY EMAIL
    // --------------------------
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Teams
// Replace the existing /api/teams GET
app.get("/api/teams", async (req, res) => {
  try {
    const { hackathonId } = req.query;
    const query = hackathonId ? { hackathonId } : {};
    const teams = await teamsCollection.find(query).toArray();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teams" });
  }
});

app.post("/api/request/respond", async (req, res) => {
  try {
    const { requestId, action, notificationId } = req.body; // action: "accept" | "reject"

    // Update request status
    await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: action === "accept" ? "accepted" : "rejected" } }
    );

    // Delete the notification after responding
    await notificationsCollection.deleteOne({
      _id: new ObjectId(notificationId)
    });

    res.json({ success: true, action });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/request/send", async (req, res) => {
  try {
    const { fromUserId, toUserId, fromUserName } = req.body;

    // Guard against missing fields
    if (!fromUserId || !toUserId || !fromUserName) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${!fromUserId ? 'fromUserId ' : ''}${!toUserId ? 'toUserId ' : ''}${!fromUserName ? 'fromUserName' : ''}`
      });
    }

    const request = await requestsCollection.insertOne({
      fromUserId: fromUserId.toString(),
      toUserId: toUserId.toString(),
      type: "connection",
      status: "pending",
      createdAt: new Date()
    });

    await notificationsCollection.insertOne({
      toUserId: toUserId.toString(),        // ← always store as string
      message: `${fromUserName} wants to connect with you`,
      type: "connection_request",
      requestId: request.insertedId,
      fromUserId: fromUserId.toString(),
      fromUserName,
      isRead: false,
      createdAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Send request error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await notificationsCollection
      .find({ toUserId: userId.toString() })  // match as string
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Add this after your /api/users route
app.get("/api/me", async (req, res) => {
  try {
    const email = req.query.email; // e.g. /api/me?email=user@example.com
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/teams/:id/join", async (req, res) => {
  try {
    const { userId } = req.body;
    await teamsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $addToSet: { members: userId } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add this in server.js
app.post("/api/teams", async (req, res) => {
  try {
    const { teamName, projectName, description, requiredSkills, maxMembers, role, hackathonId, createdBy } = req.body;

    const newTeam = {
      teamName,
      projectName,
      description,
      requiredSkills: requiredSkills.split(",").map(s => s.trim()),
      maxMembers,
      role,
      hackathonId,
      createdBy,
      members: [createdBy],
      createdAt: new Date()
    };

    await teamsCollection.insertOne(newTeam);
    res.status(201).json({ success: true, data: newTeam });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Hackathon registration
app.post("/api/hackathons/:id/register", async (req, res) => {
  try {
    const { userId } = req.body;
    const hackathonId = req.params.id;

    // Guard against undefined/invalid IDs
    if (!hackathonId || hackathonId === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid hackathon ID" });
    }
    if (!userId || userId === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    await hackathonsCollection.updateOne(
      { _id: new ObjectId(hackathonId) },
      { $addToSet: { participants: userId } }  // store userId as string, no ObjectId wrap
    );

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },           // userId from MongoDB is already a valid hex string
      { $addToSet: { hackathons: hackathonId } }
    );

    res.json({ success: true, message: "Registered for hackathon" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add this in server.js
app.get("/api/connections/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all accepted requests involving this user
    const accepted = await requestsCollection.find({
      status: "accepted",
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    }).toArray();

    // Extract the other person's ID from each connection
    const connectedUserIds = accepted.map(req =>
      req.fromUserId === userId ? req.toUserId : req.fromUserId
    );

    // Fetch their user documents
    const connections = await usersCollection.find({
      _id: { $in: connectedUserIds.map(id => new ObjectId(id)) }
    }).toArray();

    res.json({ success: true, data: connections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get("/api/requests/pending/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const pending = await requestsCollection.find({
      fromUserId: userId,
      status: "pending"
    }).toArray();

    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// -----------------------------
// Server Start
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});