import Navbar from './components/Navbar';
<<<<<<< HEAD
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './Layout';
import './index.css'
import Discover from './pages/Teams';
import { useState } from 'react';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Hackathon from './pages/Hackathon';
import About from './pages/About';
import Contact from './pages/Contact';
import Chatbot from './components/Chatbot';
import HostRegistration from './pages/HostRegistration'
import HostLogin from './pages/HostLogin'
import HostDetails from './pages/HostDetails'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  // ← CHANGE 1: Initialize from localStorage so refresh doesn't reset user to null
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const ProtectedRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/login" replace />;
  }

  return (
    <>
      <div>
        <Router>
          
          <Layout>
            
            <Routes>

              <Route path="/" element={<Home />} />

              {/* CHANGE 2: pass full user object not just name */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/host" element={<HostDetails/>}/>
              <Route path="/host-register" element={<HostRegistration />} />
              <Route path="/hackathon-register" element={<Navigate to="/explore-hackathons" replace />} />
              <Route path="/host-login" element={<HostLogin />} />
              <Route path="/profile" element={
                <ProtectedRoute user={user}>
                  <Profile />
                </ProtectedRoute>} />

              <Route path="/explore" element={
                <ProtectedRoute user={user}>
                  <Explore />
                </ProtectedRoute>} />

              <Route path="/discover/:hackathonId" element={
                <ProtectedRoute user={user}>
                  <Discover />
                </ProtectedRoute>
              } />

              {/* <Route path="/host" element={
                <ProtectedRoute user={user}>
                  <Login />
                </ProtectedRoute>
              } /> */}

              <Route path="/team" element={
                <ProtectedRoute user={user}>
                  <Discover />
                </ProtectedRoute>
              } />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path='/explore-hackathons' element={<Hackathon />} />
              
            </Routes>
            
          </Layout>
          <Chatbot /> 
        </Router>
      </div>
=======
import SideProfile from './components/SideProfile';
import CreatePost from './components/CreatePost';
import Login from './pages/Login';
import Register from './pages/RegistrationPage';
import Home from './pages/Home';
import Layout from './Layout';
import './index.css'
import Team from './pages/Teams';
import { useState } from 'react';
import Profile from './pages/Profile';
import Explore from './pages/Explore';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
const [user,setUser] = useState("Abhi");
  //const navigate = useNavigate();
  const ProtectedRoute = ({user,children})=>{
    return user ? children : <Navigate to="/login" replace />;
  }
  return (
    <>
    <div>
      
    <Router>
    <Layout> 
      <Routes>
            
        {/* <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
       
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/explore" element={<Explore/>}/>
           <Route path="/team" element={
            <ProtectedRoute  user={user}>
            <Team/>
            </ProtectedRoute>
            }/>
      </Routes>
      </Layout>
    </Router>
    
    </div>
>>>>>>> a51493c67f89740527f8b6f582e697742321a478
    </>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> a51493c67f89740527f8b6f582e697742321a478
