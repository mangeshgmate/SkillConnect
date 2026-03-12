import React from 'react'
import { PiX } from 'react-icons/pi';
import { useState } from 'react';
const Discover = () => {
  const [isJoinClicked,clickJoin] = useState(false);
  const handleJoin = ()=>{
    clickJoin(true);
  }

    const handleCreate = ()=>{
    clickJoin(false);
  }
  return (
    <>
      <div className="h-screen font-primary">
        
        <button className="h-[50px] w-[120px] m-[2px] bg-primary flex-1 p-[10px]  border-none font-bold cursor-pointer mb-[20px] ml-[40px] text-black"
        onClick={()=>handleCreate()}>
          CREATE
        </button>

        <button className="h-[50px] w-[120px] m-[2px] bg-primary flex-1 p-[10px]  border-none font-bold cursor-pointer mb-[20px] ml-[40px] text-black"
        onClick={()=>handleJoin()}>
          JOIN
        </button>

        <hr />
    {/*Create by default*/}
    { !isJoinClicked &&
        <div className="mt-[20px] h-[600px] w-full  flex justify-center">
          
          <div className="details w-[50%] flex  justify-center bg-base">
            
            <form className="w-full max-w-3xl p-6 rounded-lg text-white">

              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded mb-4 bg-base border-b-2 border-b-muted"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full  p-3 rounded mb-4 bg-base  border-b-2 border-b-muted"
              />

              <textarea
                placeholder="Message"
                rows="4"
                className="w-full p-3 rounded mb-4 bg-base border-2 border-muted"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-base text-white p-3 rounded border border-primary"
              >
                Create
              </button>

            </form>

          </div>
          <div className="invite flex flex-col items-center border-l border-l-muted w-[50%] text-white">
               <div>NETWORK INVITE</div> 
               <div className="Connections_display ">
                  

               </div>
        </div>

        
        </div>
}:{
  <h1>This is Join</h1>
}

      </div>
    </>
  )
}

export default Discover