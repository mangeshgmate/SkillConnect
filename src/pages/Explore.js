import React from 'react'
import { CiFilter } from "react-icons/ci";
import { useState } from 'react';

const Explore = () => {

  const [isFilterOpen,openFilter] = useState(false);
  return (
    <div className="text-white">
      <div className="search-container flex flex-row w-full items-center justify-center gap-5">
          <div className="search-box bg-base  font-primary text-white w-[50%]">
            <input type="text" placeholder="Search for Grinders" className="bg-base w-full p-4 rounded-3xl border-2 border-primary"/>
        </div>
      <CiFilter className="text-4xl text-white cursor-pointer hover:text-primary"
      onClick={()=>openFilter(!isFilterOpen)}/>
    </div>
    
{
  isFilterOpen && (
    <div className="absolute border-2 border-muted bg-base w-full z-50 mt-4  p-6 shadow-lg">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Role */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Role</h3>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"/>
              Frontend Developer
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"/>
              Backend Developer
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"/>
              ML / AI Engineer
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"/>
              UI / UX Designer
            </label>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="border border-muted px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-black">React</span>
            <span className="border border-muted px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-black">Node.js</span>
            <span className="border border-muted px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-black">Python</span>
            <span className="border border-muted px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-black">Figma</span>
            <span className="border border-muted px-3 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-black">Docker</span>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Experience</h3>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="exp" className="accent-primary"/>
              Beginner
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="exp" className="accent-primary"/>
              Intermediate
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="exp" className="accent-primary"/>
              Advanced
            </label>
          </div>
        </div>

        {/* Team Requirement */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Team Needs</h3>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"/>
              Looking for Members
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary"/>
              Looking for Team
            </label>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button className="px-5 py-2 border border-muted  hover:bg-muted">
          Reset
        </button>
        <button className="px-5 py-2 bg-primary text-base font-bold  hover:opacity-90">
          Apply Filters
        </button>
      </div>

    </div>
  )
}

    <div className="content text-white p-5">
      <hr></hr>
      </div>
    </div>
  )
}

export default Explore
