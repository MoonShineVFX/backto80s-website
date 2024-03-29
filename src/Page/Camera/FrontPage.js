import React,{useEffect,useState} from 'react'
import { Link,useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Button,Checkbox,Typography,Input } from "@material-tailwind/react";
import {useImage} from '../../Helper/ImageContext'
import { setUsernameToCookie } from '../../Helper/Helper';
import CustomAlert from "../../Helper/CustomAlert";
function FrontPage({handleClick}) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const { username, setUsername } = useImage();
  // const [isHovered, setHovered] = useState(false)
  const onChange = ({ target }) => setUsername(target.value);
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const element1Controls = useAnimation();
  const element2Controls = useAnimation();
  const handleMouseEnter = () => {
      setIsHovered(true);
  };
  const handleMouseLeave = () => {
      setIsHovered(false);
  };


  const handleStart = ()=>{
      setNotification(null)
      setTimeout(()=>{
        navigate("/camera");
      },800)
  }





  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const test = async()=>{
    const res = await fetch('https://backto80s-api.rd-02f.workers.dev/images/25076e68-e2b7-4967-a316-2f4ef262a3dc',{
    })
    const responseData = await res.json();
    console.log('123')
    console.log(responseData)
  }
  // test()

  return (
        <div className='flex flex-col justify-between items-center md:justify-center w-full px-0 pt-[20%] md:pt-[15%] lg:pt-[14%]  '>
          {notification && (
            <CustomAlert message={notification} onClose={() => setNotification(null)} />
          )}
          
          <div 
            className=' relative w-full md:w-8/12 lg:w-7/12 mx-auto   text-center '
          >
            <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/logo_m.png" alt="" className='block lg:hidden mx-auto my-5 w-1/2 md:w-5/12' />
            <motion.div 
              className=' md:my-2 text-gray-200 absolute left-1/2 -translate-x-1/2 w-10/12 z-20 '
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/logo.png" alt=""  className=' hidden lg:block '/>
              
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className='mx-auto relative overflow-hidden z-0  w-6/12 md:w-4/12'
            >

              <img
                src= {'https://r2.web.moonshine.tw/msweb/backto80s_ai/bg-transparent.png?width=330'}
                alt="card-image"
                className='max-w-full w-full relative  z-10 '

              />
              <div className=' absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5  z-0  overflow-hidden'>
                <motion.div 
                  initial={{ x:0 ,y: -200 , rotate:60}}
                  animate={{ y: 580 }}
                  transition={{ ease: "linear", duration: 1, repeat: Infinity ,repeatDelay:4}}
                  className=' absolute  w-2/3 h-[100%] opacity-1  z-10'
                  style={{
                    background: 'linear-gradient( to right, rgba(255, 255, 255, 0.23) 0%, rgba(255, 255, 255, 0.23) 77%, rgba(255, 255, 255, 0.5) 92%, rgba(255, 255, 255, 0.0) 100%)'}}
                >
                </motion.div>
                <motion.div 
                  initial={{ x:0 ,y: -200 , rotate:60}}
                  animate={{ y: 580 }}
                  transition={{ ease: "linear", duration: 1, repeat: Infinity ,repeatDelay:4,delay:0.2}}
                  className=' absolute  w-[90px] h-[100%] opacity-1  z-10'
                  style={{
                    background: 'linear-gradient( to right, rgba(255, 255, 255, 0.23) 0%, rgba(255, 255, 255, 0.23) 77%, rgba(255, 255, 255, 0.5) 92%, rgba(255, 255, 255, 0.0) 92%)'}}
                >
                </motion.div>
                <div className='w-full'>
                  <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/mirror01.png" alt="" className='w-full' />
                </div>

                <div className={`${isHovered ? 'opacity-100' : 'opacity-0' } transition-all duration-500  absolute top-0 left-0 z-0 w-full `}>
                  <img
                    src= {'https://r2.web.moonshine.tw/msweb/backto80s_ai/mirror02.png?width=320'}
                    alt="card-image"
                    className='max-w-full w-full  '
                  />
                </div>
              </div>
            </motion.div>
          </div>
          <div className='mt-auto flex flex-col justify-center items-center'>

            <div className='flex flex-col gap-2 md:flex-row md:gap-0  w-4/5 md:w-full   '>

              <div 
                className=' relative rounded-r-lg cursor-pointer  w-4/5 md:w-4/6 mx-auto -mt-6  hover:-translate-y-1 transition-all'
                onClick={handleStart}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/btn_start.png" alt="start"  className=''/>
              </div>

            </div>
  
          </div>




        </div>

        

        

  
          

     



  )
}

export default FrontPage