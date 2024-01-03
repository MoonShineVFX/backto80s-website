import React,{useState,useEffect} from 'react'
import { Outlet,useLocation,Link} from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import {getUsernameFromCookie} from '../Helper/Helper'
import { motion,useAnimation } from "framer-motion";
function CameraLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  const storedUsername = getUsernameFromCookie();

  const imgAnimation = useAnimation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // 監聽滑鼠移動事件並更新滑鼠位置
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    console.log(clientX, clientY)
    setMousePosition({ x: clientX, y: clientY });
  };
  // 根據滑鼠位置計算視差效果
  useEffect(() => {
    const offsetFactor = 10;
    const moveX = mousePosition.x - window.innerWidth / 2;
    const moveY = mousePosition.y - window.innerHeight / 2;
    console.log(moveX, moveY)
    imgAnimation.start({
      x: moveX / offsetFactor,
      y: moveY / offsetFactor,
    });
  }, [mousePosition, imgAnimation]);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
 
  return (
    <div 
      className='min-h-[100vh] h-screen md:h-auto relative  text-white bg-no-repeat bg-cover bg-center z-10'
      style={{
        backgroundImage: `url('https://moonshine.b-cdn.net/msweb/backto80s_ai/bg01.png')`,
      }}
    >   
        <div className='w-full md:aspect-[14/6] flex flex-col h-full md:h-auto justify-between  px-0 md:px-2 pt-4 md:pt-10 relative'>
          <div className='flex justify-between md:h-14  items-start px-10 md:px-0 flex-col md:flex-row '>
            <div className='w-full md:w-1/4  mt-0 md:mt-0 h-full order-2 md:order-1'>
            {location.pathname === '/camera' ? 
              <>
                <Link to='/' className=" " >
                  <Button variant="text" className="flex items-center gap-3 text-white p-0 mb-2 hover:text-red-500 text-base">
                    <FaArrowLeft size={15} />
                    Back 
                  </Button>
                </Link>
                <div className='flex items-center gap-2'>
                  <img src={process.env.PUBLIC_URL+'/images/title_slash.svg'} alt="" className='max-w-full   '/> 
                  <div className='text-[#FF0050] text-base font-bold'>STEP1 : Take Photo </div>
                </div>

              </>
              :
              ''
            }
            </div>
            
            {/* <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/header_right.gif" alt="" className='max-w-screen w-1/2 md:w-auto md:h-full ml-auto order-1 md:order-2 ' /> */}
          </div>

          <div 
            className={`${isMobile ? "h-full ":  "" } flex flex-col w-full mx-auto  items-center md:mt-0 py-1 relative `}
          >
            <div className=' w-full md:w-auto absolute top-0 left-0 z-10 right-0'>
             
              {
                location.pathname === '/camera' && 
                  <div className="mt-4  text-white/70 text-xs text-center md:text-left">
                    <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/page_fui01_gif.gif" alt="p01" className='max-w-full hidden md:block  ' /> 
                  </div>
              }
            </div>
           
            
            <Outlet />

           
            
          </div>
    


      
        {/* <div className='text-sm text-white/30  text-center p-2'>
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </div> */}

      </div>
      {location.pathname === '/' &&
        <div 
          onMouseMove={(e) => handleMouseMove(e)} 
          className='bg-black/10 absolute w-full h-screen top-0 -z-10 '
        >
          <motion.div 
            animate={imgAnimation}
            className=' absolute -top-20 -left-10'
          >
            <img src="https://moonshine.b-cdn.net/msweb/backto80s_ai/icon01.png" alt="" />
          </motion.div>
        </div>

      }

        
   
    </div>
  )
}

export default CameraLayout