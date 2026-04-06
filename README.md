<<<<<<< HEAD
# SkillConnect 🚀

> **The home for hackathons.** Discover events, analyse your GitHub skills, and build winning teams with complementary developers.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SkillConnect is a full-stack web platform that solves one of the biggest pain points in hackathon participation: **finding the right teammates**. Instead of relying on self-reported skills, SkillConnect automatically analyses a developer's GitHub repositories to detect programming languages, infer frameworks, and assign weighted developer roles (Frontend Developer, Backend Developer, ML/AI Engineer, UI/UX Designer).

Participants can then browse hackathons, connect with other developers, form structured teams, and manage connection requests — all in one place.

---

## Features

| Feature | Description |
|---|---|
| 🔍 **GitHub Skill Analysis** | Automatically analyses all public repos and maps languages to developer roles with percentage scores |
| 🏆 **Hackathon Discovery** | Browse, search, and filter hackathons by type (Online/Offline), location, and date |
| 👥 **Developer Explore** | Find other developers with role and skill filters; view their full GitHub-backed profiles |
| 🤝 **Connection System** | LinkedIn-style connection requests with accept/reject functionality |
| 🔔 **Real-Time Notifications** | Bell icon with badge count; polling-based notification delivery every 15 seconds |
| 🏗️ **Team Formation** | Create or join hackathon-specific teams; role-complement matching suggests the right teammates |
| 📬 **Teammate Invites** | Invite from your network or all users; smart filtering based on your role |
| 👤 **Developer Profile** | View skills, connections, teams, and past hackathon projects |
| 📋 **Hackathon Registration** | Register for events and simultaneously create a team in the Discover page |

---

## Tech Stack

### Frontend
- **React.js 18** — SPA framework
- **React Router DOM v6** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client
- **Framer Motion** — animations (StepSection)
- **React Icons** — icon library

### Backend
- **Node.js 20** with **Express.js** — REST API server
- **MongoDB Atlas** (via native MongoDB driver) — cloud database
- **bcrypt** — password hashing
- **dotenv** — environment variable management
- **Axios** — GitHub API calls from the server

### External Services
- **GitHub REST API v3** — repository language analysis

---

## Project Structure

```
skillconnect/
├── client/                     # React frontend
│   ├── public/
│   │   └── demo.mp4            # Demo video for DemoSection
│   └── src/
│       ├── animations/
│       │   └── TextType.js     # Typewriter animation component
│       ├── components/
│       │   ├── Navbar.js       # Navigation + notifications + profile dropdown
│       │   ├── Modal.js        # Hackathon detail modal
│       │   ├── UserModal.js    # Developer profile modal
│       │   ├── DemoSection.js  # Video + feature highlights section
│       │   └── StepSection.js  # Animated 4-step onboarding section
│       └── pages/
│           ├── Home.js             # Landing page with hackathon carousel
│           ├── Login.js            # Login form
│           ├── Register.js         # Registration with GitHub fetch
│           ├── Explore.js          # Developer discovery + connections
│           ├── Hackathon.js        # Hackathon listing + filters
│           ├── Teams.js            # Team create/join/invite (Discover page)
│           ├── Profile.js          # User profile page
│           ├── About.js            # About section
│           ├── Contact.js          # Contact cards
│           ├── RegistrationPage.js # Hackathon registration form
│           └── Authenticate.js     # Auth helper utility
└── server/
    └── server.js               # Express REST API + MongoDB connection
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 LTS or v20 LTS — [Download](https://nodejs.org/)
- **npm** v9+ (bundled with Node.js)
- **Git** v2.30+
- A **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- A **GitHub Personal Access Token** with `public_repo` read scope — [Create one](https://github.com/settings/tokens)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/skillconnect.git
cd skillconnect
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server/` directory (see [Environment Variables](#environment-variables) below).

### 5. Set up MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database named **`hackathonDB`**.
3. Create the following collections:
   - `users`
   - `hackathons`
   - `teams`
   - `requests`
   - `notifications`
4. Copy your **connection string** and add it to `.env` as `MONGODB_URI`.
5. Whitelist your IP address in Atlas Network Access.

---

## Environment Variables

Create `server/.env` with the following variables:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hackathonDB?retryWrites=true&w=majority

# GitHub Personal Access Token (repo read scope)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Server port (optional, defaults to 5000)
PORT=5000
```

> ⚠️ **Never commit your `.env` file to version control.** It is included in `.gitignore`.

---

## Running the Application

### Start the backend server

```bash
cd server
node server.js
# or with hot-reload:
npx nodemon server.js
```

The server starts at **http://localhost:5000**

### Start the React frontend

```bash
cd client
npm start
```

The React app opens at **http://localhost:3000**

> Both processes must run simultaneously. Use two terminal windows or a process manager like `concurrently`.

### One-command start (from root, if configured)

```bash
# Install concurrently at root level
npm install -g concurrently

# Then from project root:
concurrently "cd server && node server.js" "cd client && npm start"
```

---

## API Reference

All endpoints are served from `http://localhost:5000`.

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | `{ name, email, password, githubId }` | Register a new user; triggers GitHub analysis |
| `POST` | `/api/login` | `{ email, password }` | Authenticate and return user object |

### GitHub

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/github/:username` | Fetch language stats and role percentages for a GitHub user |

### Hackathons

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hackathons` | List all hackathons |
| `GET` | `/api/hackathons/:id` | Get a single hackathon by ID |
| `POST` | `/api/hackathons/:id/register` | Register a user for a hackathon |
| `GET` | `/promotionalHackathons` | All hackathons (used for homepage carousel) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users (or single user with `?email=`) |
| `GET` | `/api/me?email=` | Get current user's full profile |

### Teams

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/teams` | — (optional `?hackathonId=`) | List teams (optionally filtered by hackathon) |
| `POST` | `/api/teams` | Team object | Create a new team |
| `POST` | `/api/teams/:id/join` | `{ userId }` | Join an existing team |

### Connections & Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/request/send` | Send a connection request |
| `POST` | `/api/request/respond` | Accept or reject a request |
| `GET` | `/api/connections/:userId` | Get all accepted connections for a user |
| `GET` | `/api/requests/pending/:userId` | Get all pending outgoing requests |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications/:userId` | Get all pending notifications for a user |

---

## Usage Guide

### 1. Create an account

Navigate to `/register`. Enter your name, email, and password. Paste your GitHub profile URL and click **Fetch** — your skills and detected developer roles will appear automatically. Click **Create Account** to register.

### 2. Log in

Go to `/login`, enter your credentials, and you will be redirected to the home page on success.

### 3. Explore hackathons

Use the **HACKATHONS** link in the navbar to browse events. Filter by type, location, or date. Click **Explore** to see full details in a modal, or **Register** to proceed to team formation for that hackathon.

### 4. Discover and connect with developers

Go to **EXPLORE** to browse all registered developers. Use the filter panel to narrow by role or skill. Click **Connect** to send a connection request; the button changes to **Pending** immediately.

### 5. Accept connection requests

The bell icon in the navbar shows pending requests. Click it to open the notification dropdown and accept or decline each request.

### 6. Form a team

After registering for a hackathon (via the Register button on any hackathon card), you will be taken to the **Discover** page for that event. Switch between **CREATE** (to create your own team and invite teammates) and **JOIN** (to browse and join existing teams).

### 7. View your profile

Click the user icon in the navbar and select **My Profile** to view your skills, connections, teams, and hackathon projects.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`.

Please ensure all new API routes include input validation and that any client-side state changes are reflected optimistically where appropriate.

---

## Known Issues

- The login endpoint currently compares passwords in plaintext; bcrypt comparison on login is a planned fix.
- Notifications use HTTP polling (15s interval) instead of WebSockets — will be replaced in a future release.
- No session expiry; localStorage sessions persist indefinitely until manual logout.

---

## License

This project is licensed under the **MIT License**. See `LICENSE` for details.

---

<p align="center">Built with ❤️ for the hackathon community</p>
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> a51493c67f89740527f8b6f582e697742321a478
