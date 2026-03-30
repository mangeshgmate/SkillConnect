import React from 'react'
import Navbar from './components/Navbar';
import { FaTwitter, FaDiscord, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {

  const socialLinks = [
    {
      name: "Twitter",
      icon: <FaTwitter />,
      link: "https://twitter.com/devpost",
    },
    {
      name: "Discord",
      icon: <FaDiscord />,
      link: "https://discord.com/invite/HP4BhW3hnp",
    },
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      link: "https://www.facebook.com/devposthacks",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      link: "https://www.linkedin.com/company/devpost/",
    },
  ];

  return (
    <div className="bg-base min-h-screen flex flex-col">

      <Navbar />

      <div className="mt-[50px] flex-grow">
        {children}
      </div>

      <footer className="text-white flex flex-col min-h-40 items-center justify-center bg-base">

        <div className="border-t border-t-muted border-b border-b-muted w-full flex flex-col md:flex-row items-center md:items-start justify-between p-10 gap-8">

          <div className='small-6 large-3'>
            <nav>
              <h4 className="text-lg font-semibold mb-3">Portfolio</h4>
              <ul>
                <li>
                  <Link to="/about" className="hover:text-primary transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-primary transition">
                    Help
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Hackathon Section */}
          <div className="small-6 large-3">
            <nav>
              <h4 className="text-sm font-semibold mb-3">Hackathons</h4>
              <ul>
                <li>
                  <Link to="/explore-hackathons" className="hover:text-primary transition">
                    Browse Hackathons
                  </Link>
                </li>
                <li>
                  <Link to="/host-hackathon" className="hover:text-primary transition">
                    Host a Hackathon
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className='small-6 large-3'>
            <nav>
              <h4 className="text-lg font-semibold mb-3">Portfolio</h4>
              <ul>
                <li>
                  <Link to="/profile" className="hover:text-primary transition">
                    Your Teams
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-primary transition">
                    Your Projects
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div className="w-full md:w-1/4">
            <nav>
              <h4 className="text-md font-semibold text-white mb-4">Connect</h4>

              <ul className="space-y-4">

                {socialLinks.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group"
                    >

                      {/* Icon */}
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-xl text-white group-hover:bg-primary group-hover:text-black transition">
                        {item.icon}
                      </div>

                      {/* Label */}
                      <span className="text-gray-300 group-hover:text-primary transition">
                        {item.name}
                      </span>

                    </a>
                  </li>
                ))}

              </ul>
            </nav>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="m-6 font-primary text-sm text-gray-400">
          © 2026 SkillConnect. All rights reserved.
        </div>

      </footer>

    </div>
  )
}

export default Layout