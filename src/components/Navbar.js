import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="nav">
            <a href="/" className="site-title">
                SkillConnect
            </a>
            <ul>
                <li>
                    <a href="/Dashboard">Dashboard</a>
                </li>
                <li>
                    <a href="/Discover Teamates">Discover Teamates</a>
                </li>
                <li>
                    <a href="/My Team">My Team</a>
                </li>
                <li>
                    <a href="/Create / Join Team">Create / Join Team</a>
                </li>
                <li>
                    <a href="/Recommendation">Recommendation</a>
                </li>
                <li>
                    <a href="/My Profile">My Profile</a>
                </li>
                <li>
                    <a href="/Settings">Settings</a>
                </li>
                <li>
                    <a href="/Logout">Logout</a>
                </li>
            </ul>
        </nav>
    )
}