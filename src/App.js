import Navbar from './components/Navbar';
import SideProfile from './components/SideProfile';
import CreatePost from './components/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './Layout';
import './index.css'
import Team from './pages/Teams';
import { useState } from 'react';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Hackathon from './pages/Hackathon';
import RegistrationPage from './pages/RegistrationPage';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';


function App() {
const [user,setUser] = useState(null);
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
       
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />}/>
          <Route path="/register" element={<Register/>}/>


          <Route path="/hackathon-register" element={
            <ProtectedRoute user={user}>
              <RegistrationPage/>
              </ProtectedRoute> }/>

          <Route path="/profile" element={
          <ProtectedRoute user={user}>
              <Profile/>
              </ProtectedRoute> }/>

          <Route path="/explore" element={
          <ProtectedRoute user={user}>
              <Explore/>
              </ProtectedRoute> }/>

          <Route path="/host" element={
            <ProtectedRoute  user={user}>
            <Hackathon/>
            </ProtectedRoute>
            }
          />

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
