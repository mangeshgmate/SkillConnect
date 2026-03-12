import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load users data
const usersFilePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../src/data/users.json');

// Login API endpoint
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Read users from file
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(usersData);

    // Find user with matching credentials
    const user = users.find((u) => u.Email === email && u.Password === password);

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          UserID: user.UserID,
          Username: user.Username,
          Email: user.Email
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
