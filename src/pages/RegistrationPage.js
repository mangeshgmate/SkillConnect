import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    github: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to save data would go here (e.g., API call)
    console.log("User Registered:", formData);
    
    // Redirect to Join Team page
    navigate('/join');
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <h2>Hackathon Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>

          <div className="input-group">
            <label>Email ID</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
            />
          </div>

          <div className="input-group">
            <label>GitHub Profile Link</label>
            <input 
              type="url" 
              required 
              value={formData.github}
              onChange={(e) => setFormData({...formData, github: e.target.value})}
              placeholder="https://github.com/username"
            />
          </div>

          <button type="submit" className="submit-btn">Submit & Continue</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;