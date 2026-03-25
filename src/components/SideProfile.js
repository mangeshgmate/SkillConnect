import "./SideProfile.css";

export default function SideProfile() {
  return (
    <div className="side-profile">
      <div className="profile-header">
        <img
          src="https://i.pravatar.cc/150?img=3"
          alt="profile"
          className="profile-img"
        />
        <h3>John Adams</h3>
        <p className="role">AI / Full Stack Developer</p>
      </div>

      <div className="profile-stats">
        <div>
          <span>Connections</span>
          <b>128</b>
        </div>
        <div>
          <span>Projects</span>
          <b>14</b>
        </div>
        <div>
          <span>Skills</span>
          <b>22</b>
        </div>
      </div>

      <div className="profile-about">
        <h4>About</h4>
        <p>
          AI/DS Btech student passionate about AI, ML, and building
          real-world web applications.
        </p>
      </div>

      <div className="profile-skills">
        <h4>Top Skills</h4>
        <div className="skills">
          <span>Python</span>
          <span>React</span>
          <span>ML</span>
          <span>Firebase</span>
          <span>SQL</span>
        </div>
      </div>

      <button className="profile-btn">View Full Profile</button>
    </div>
  );
}
