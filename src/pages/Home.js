import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const filters = [
    "Offline/Online","Type","Date","Location"
  ];

  const hackathons = [
    {
      id: 1,
      title: "CodeRush 2026",
      description: "AI challenge",
      date: "March 15",
      time: "10:00 AM",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      title: "Web3 Summit",
      description: "Blockchain build",
      date: "April 02",
      time: "09:00 AM",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      title: "AI Builders Hack",
      description: "Build innovative Generative AI applications",
      date: "March 20",
      time: "11:00 AM",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      title: "CyberSec Hackathon",
      description: "Solve real-world cybersecurity challenges",
      date: "April 10",
      time: "10:30 AM",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      title: "Open Innovation Jam",
      description: "Create solutions for sustainability and social impact",
      date: "May 05",
      time: "09:30 AM",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      title: "DevNetwork AI/ML Hack",
      description: "Develop cutting-edge AI/ML powered apps",
      date: "May 15",
      time: "08:00 AM",
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <div className="p-10 min-h-screen font-primary">

      {/* Hero Section */}
      <div className="h-[500px] w-full border border-[#9499A4] rounded-md mb-5"></div>

      {/* Domain Buttons */}
      
                  <div className="flex items-center justify-center gap-10">
        {filters.map((value)=>(

            <button className="bg-primary p-3 font-bold">{value}</button>
 
        ))}
           </div>
    
      {/* Heading */}
      <h1 className="text-center m-[50px] text-white text-[2.5rem] font-semibold">
        Upcoming Hackathons
      </h1>

      {/* Hackathon Cards */}
      <div className="flex flex-wrap gap-6 justify-center font-primary">

        {hackathons.map((event) => (
          <div
            key={event.id}
            className="w-[320px] h-[320px] border border-[#AAFF34] overflow-hidden transition-transform duration-300 hover:-translate-y-[5px] flex flex-col"
          >

            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[120px] object-cover"
            />

            <div className="p-5">

              <h2 className="text-[1.2rem] text-primary mb-2">
                {event.title}
              </h2>

              <p className="text-[0.9rem] text-[#6c757d] mb-3 font-semibold">
                {event.date} at {event.time}
              </p>

              <p className="text-[0.95rem] text-[#555] leading-relaxed mb-5">
                {event.description}
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 py-2 font-bold cursor-pointer border border-primary text-white hover:bg-primary hover:text-base"
                >
                  Register
                </button>

                <button className="flex-1 py-2 bg-base text-white border border-primary  font-bold cursor-pointer hover:bg-primary hover:text-base">
                  Explore
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
      <div className="Extra-section h-[400px] w-full">

      </div>

    </div>
  );
};

export default Home;