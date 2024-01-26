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
      className='min-h-[100vh] relative bg-black text-white bg-no-repeat bg-center bg-cover flex items-start md:items-center pt-[10%] md:pt-[5%]'
      style={{
        backgroundImage: `url('https://r2.web.moonshine.tw/opt/lg/msweb/backto80s_ai/bg01.png')`,
      }}
    > 
        <div className='w-full   flex flex-col items-center md:mt-0 relative'>
            <Outlet />


      
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