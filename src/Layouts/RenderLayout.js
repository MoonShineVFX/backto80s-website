import React,{useState} from 'react'
import { Outlet,useLocation,Link} from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import {getUsernameFromCookie} from '../Helper/Helper'
import { motion,useAnimation } from "framer-motion";
function RenderLayout() {
  const storedUsername = getUsernameFromCookie();
  return (
    <div 
      className='min-h-[100vh] relative bg-black text-white bg-no-repeat bg-center bg-cover '
      style={{
        backgroundImage: `url('https://r2.web.moonshine.tw/opt/lg/msweb/backto80s_ai/bg01.png')`,
      }}
    > 

          <motion.div 
            className=' pt-8 text-gray-200   w-2/5 mx-auto z-20 '
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/logo.png" alt="" />
          </motion.div>
        <div className='w-full  px-0 md:px-12 pt-4 md:pt-10 flex flex-col '>
          <div className='flex justify-between items-start md:h-10 px-10 md:px-0 flex-col md:flex-row'>
            <div className='w-full md:w-1/3 mt-0 md:mt-0  order-2 md:order-1'>

              <div className='flex items-center gap-2 relative'>
                <img src={process.env.PUBLIC_URL+'/images/title_heart.png'} alt="" className='max-w-full absolute -top-3 left-1 w-7   '/> 
                <div className='text-[#FF0050] text-base font-bold bg-[#FFF7BB] border-[#111111] border rounded-full  px-3 py-1 ml-2'>STEP2 : Choose a module </div>
              </div>
              <Link to='/camera' className=" " >
                <Button variant="text" className="flex items-center gap-3 text-[#FF3976] p-0 mb-2  text-2xl font-extrabold  mt-2 drop-shadow-[0_0.8px_0.1px_rgba(0,0,0,0.8)]">
                  <FaArrowLeft size={15} />
                  Back 
                </Button>
              </Link>

            </div>
          </div>
          <div className='mt-7 md:mt-6 relative md:my-10 px-0 md:mx-10'>


            <Outlet />
          </div>


        

      
        {/* <div className='text-sm text-white/30  text-center p-2'>
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </div> */}

      </div>

        
   
    </div>
  )
}

export default RenderLayout