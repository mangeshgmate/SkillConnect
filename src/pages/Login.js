import { useState } from "react";
import { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
// import Authenticate from "./Authenticate";
import { FaGithub,FaGoogle,FaLinkedin,FaFacebook } from "react-icons/fa";
export default function Login({setUser}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginData,setLoginData] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
const [showPopup, setShowPopup] = useState(false);

  const Navigate = useNavigate();



  function handleSubmit(e){
    e.preventDefault();
    console.log(email,password);

      fetch("http://localhost:5000/api/login",{
        method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  }).then((res)=>res.json()).then((data)=>{
    setLoginData(data);
     if(data.success)
     {
    setIsLogin(true);
    setUser(data.user.name)
     }
     else{
     setIsLogin(false);     
     }
  }).catch((err) => console.error(err));


   
  };



console.log(loginData);

useEffect(() => {
  if (isLogin) {
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      Navigate("/");
    }, 2000);
  }
}, [isLogin]);

  return (
    <>
    
    <div className="auth-container  bg-base ">
      <div className="auth-box flex flex-col items-center justify-center text-white h-full">
        <h1 className="font-primary">Login to SkillConnect</h1>
        <div className="border p-4 border-primary">
        <form onSubmit={handleSubmit} className=" flex flex-col items-center justify-center gap-2 text-black">
          <input type="email" 
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email" 
          className="p-2 w-full"
          required />
          <input type="password" 
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Password" 
          className="p-2 w-full"
          required />

          <button type="submit" className="bg-primary p-2 w-full text-base font-bold hover:bg-lime-400">Login</button>
        </form>
        <div className="flex flex-col items-center justify-center font-primary">
          <p className="p-2 text-[12px]">or</p>
          <p className="pb-2 text-[12px] text-muted">you can sign in with</p>
          <div className="flex flex-row gap-2 text-[30px]">
              <FaGithub className="cursor-pointer hover:text-primary"/>
              <FaGoogle className="cursor-pointer hover:text-primary"/>
              <FaLinkedin className="cursor-pointer hover:text-primary"/>
              <FaFacebook className="cursor-pointer hover:text-primary"/>
          </div>
        </div>

<Link to="/register" className="toggle-text">
  <p className="text-muted font-primary mt-4 hover:text-white">Don't have an account? Register</p>
</Link>
</div>


      </div>
            
    </div>

    {showPopup && 
      <div className="inset-0 z-50 fixed flex items-center justify-center text-white">
          <div className="border-2 border-primary font-primary bg-base p-5">
                <h1>Login was Successfull</h1>
            </div>
      </div>}

    </>
  );
}
