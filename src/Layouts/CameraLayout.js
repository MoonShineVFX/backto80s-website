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

  const images = [
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon08.png', top:'-19%' ,left:'11%' , width:'18%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon01.png', top:'-10%' ,left:'-6%' , width:'23%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon02.png', top:'30%' , left:'7%' , width:'12%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon03.png', top:'65%' , left:'-6%' , width:'30%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon04.png', top:'-15%' ,left:'75%', width:'30%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon05.png', top:'25%' , left:'70%', width:'15%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon06.png', top:'45%' , left:'76%', width:'18%'},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon07.png', top:'70%' , left:'76%', width:'28%'},
  ]
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const offsetX = (clientX - window.innerWidth / 2) / 10;
    const offsetY = (clientY - window.innerHeight / 2) / 10;
    setPosition({ x: offsetX, y: offsetY });
  };
  useEffect(() => {

    // 监听鼠标移动事件
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // 清除事件监听器
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
        backgroundImage: `url('https://r2.web.moonshine.tw/msweb/backto80s_ai/bg01.png')`,
      }}
    >   
        {location.pathname === '/camera' &&
          <motion.div 
            className=' pt-8 text-gray-200   w-2/5 mx-auto z-20 '
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/logo.png" alt="" />
          </motion.div>
        }
        <div className='w-full md:aspect-[14/6] flex flex-col h-full md:h-auto justify-between  px-0 md:px-12 pt-4 md:pt-1 relative'>
          <div className='flex justify-between md: items-start px-10 md:px-0 flex-col md:flex-row '>
            <div className='w-full md:w-full h-full '>
            {location.pathname === '/camera' ? 
              <>
                <div className='flex items-center gap-2 relative'>
                  <img src={process.env.PUBLIC_URL+'/images/title_heart.png'} alt="" className='max-w-full absolute -top-3 left-1 w-7   '/> 
                  <div className='text-[#FF0050] text-base font-bold bg-[#FFF7BB] border-[#111111] border rounded-full  px-3 py-1 ml-2'>STEP1 : Take Photo </div>
                </div>
                <Link to='/' className=" " >
                  <Button variant="text" className="flex items-center gap-3 text-[#FF3976] p-0 mb-2 text-2xl font-extrabold  mt-2 drop-shadow-[0_0.8px_0.1px_rgba(0,0,0,0.8)]">
                    <FaArrowLeft size={15} className='ml-2' />
                    Back 
                  </Button>
                </Link>

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

            <Outlet />

            
          </div>
    




      </div>
      {location.pathname === '/' &&
        <div 
          
          className='bg-black/0 absolute w-full h-full top-0 -z-10  overflow-hidden'
        >
          {images.map((image,index)=>{
            const offsetX = (position.x + index) / (index+2); // 使用索引来产生不同的偏移
            const offsetY = (position.y + index) / (index+2); 
            return(
              <div 
                onMouseMove={(e) => handleMouseMove(e)} 
                className={`absolute`}
                style={{
                  top:`${image.top}`,
                  left:`${image.left}`,
                  width:`${image.width}`,
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                }}
              >
                <img src={image.url} alt="" className='max-w-full w-full' />
              </div>
            )

            })
          }

        </div>

      }

        
   
    </div>
  )
}

export default CameraLayout