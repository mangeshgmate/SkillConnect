import { useState } from "react";
import "./Auth.css";
import { Link,useNavigate } from "react-router-dom";
import Authenticate from "./Authenticate";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const Navigate = useNavigate();

  function handleSubmit(e){
    e.preventDefault();
    console.log(email,password);
    console.log("Submitted");
    const isValid = Authenticate(email, password, isLogin);
    // console.log(isValid);
    setIsLogin(isValid);
  };
  return (
    <>
    
    <div className="auth-container fixed inset-0 z-50  bg-black/50">
      <div className="auth-box">
        <h2>Login to SkillConnect</h2>

        <form onSubmit={handleSubmit}>
          <input type="email" 
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email" required />
          <input type="password" 
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Password" required />

          <button type="submit">Login</button>
        </form>
<Link to="/register" className="toggle-text">
  Don't have an account? Register
</Link>

      </div>
      {isLogin && Navigate("/home")}
    </div>
    <div className="blur h-screen ">
      <p className="text-white text-[100px] fixed inset-0 z-50 px-20">Create<br></br> Win <br></br>Inspire</p>
      <img src="image.png"></img>
    </div>
    </>
  );
}
