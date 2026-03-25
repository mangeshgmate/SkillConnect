import React from 'react'
import Navbar from './components/Navbar';
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoGoogle,
  IoLogoLinkedin,
  IoLogoWhatsapp,
  IoLogoYoutube,
  IoLogoGithub
} from "react-icons/io";

const Layout = ({children}) => {

  const socialLinks = [
    { icon: <IoLogoFacebook />, link: "https://facebook.com" },
    { icon: <IoLogoInstagram />, link: "https://instagram.com" },
    { icon: <IoLogoGoogle />, link: "https://google.com" },
    { icon: <IoLogoLinkedin />, link: "https://linkedin.com" },
    { icon: <IoLogoYoutube />, link: "https://youtube.com" },
    { icon: <IoLogoGithub />, link: "https://github.com" },
    { icon: <IoLogoWhatsapp />, link: "https://whatsapp.com" }
  ];

  return (
    <div className="bg-base min-h-screen flex flex-col">
      
      <Navbar />

      <div className="mt-[50px] flex-grow">
        {children}
      </div>

      <footer className="text-white flex flex-col items-center justify-center bg-base">

        <div className="border-t border-t-muted border-b border-b-muted w-full flex items-center justify-end p-10 gap-4 pb-[50px] pt-[50px]">

          {socialLinks.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl  hover:text-primary transition duration-200 cursor-pointer"
            >
              {item.icon}
            </a>
          ))}

        </div>

        <div className="m-8 font-primary">
          Copyright © 2026 SkillConnect
        </div>

      </footer>

    </div>
  )
}

export default Layout