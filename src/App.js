import Navbar from './components/Navbar';
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
    </>
  );
}

export default App;
