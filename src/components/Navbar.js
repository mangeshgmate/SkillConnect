
import { Link } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useState } from 'react';
export default function Navbar() {

    const [isopen,setOpen] = useState(false);
    const menuItems = [
  { name: "My Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
  { name: "Logout", path: "/login" }
];
    
    return (
        <>
        <nav className="nav p-2  text-white flex items-center justify-center w-full ">
            <Link to="/home" className="site-title ml-0">
                <p className="text-[30px]">SkillConnect</p>
            </Link>
            <div className="flex items-center justify-end font-primary w-full mr-0 gap-5">
            <ul className="flex gap-10 ">
                <li>
                    <Link to="/">HOME</Link>
                </li>
                <li>
                    <Link to="/team">CREATE | JOIN TEAM</Link>
                </li>
                <li>
                    <Link to="/explore">EXPLORE</Link>
                </li>
                  <li>
                    <Link to="/host">HOST</Link>
                </li>

                
            </ul>
            <FiUser onClick={()=>setOpen(!isopen)} className="cursor-pointer border-2 border-primary rounded-full size-8"/>
            </div>
        </nav>
        {
            isopen && (
                <div className="absolute right-0 top-[60px] w-48 p-2 shadow-lg border border-muted text-white bg-base font-primary animate-fadeIn z-50">
                <ul>
                    {menuItems.map((item, index) => (
                            <li
                            key={index}
                            className="p-2 hover:text-primary hover:bg-secondary cursor-pointer transition duration-200"
                            >
                            <Link to={item.path}>{item.name}</Link>
                            </li>
                        ))}
                </ul>
                </div>
            )
        }
        </>
    )
}