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
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon08.png', top:'-19%' ,left:'11%' ,  width:'18%', mobile:{top:'0%',  left:'-3%',  width:"28%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon01.png', top:'-10%' ,left:'-6%' ,  width:'23%', mobile:{top:'25%', left:'-6%',  width:"33%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon02.png', top:'30%' , left:'7%' ,   width:'12%', mobile:{top:'50%', left:'-1%',  width:"20%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon03.png', top:'65%' , left:'-6%' ,  width:'30%', mobile:{top:'80%', left:'-3%',  width:"45%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon04.png', top:'-15%' ,left:'75%',   width:'30%', mobile:{top:'0%',  left:'75%', width:"35%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon05.png', top:'25%' , left:'70%',   width:'15%', mobile:{top:'25%', left:'75%', width:"35%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon06.png', top:'45%' , left:'76%',   width:'18%', mobile:{top:'50%', left:'73%', width:"34%"}},
    {url:'https://moonshine.b-cdn.net/msweb/backto80s_ai/icon07.png', top:'70%' , left:'76%',   width:'28%', mobile:{top:'80%', left:'60%', width:"45%"}},
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
      className='min-h-[100vh] h-screen md:h-auto relative  text-white bg-no-repeat bg-cover bg-center z-10 flex items-center'
      style={{
        backgroundImage: `url('https://r2.web.moonshine.tw/opt/lg/msweb/backto80s_ai/bg01.png')`,
      }}
    >   

        <div className='w-full   flex flex-col  md:h-auto justify-between   relative'>
          <div className='flex justify-between md: items-start px-10 md:px-0 flex-col md:flex-row '>
            <div className='w-full md:w-full h-full '>
            {location.pathname === '/camera' ? 
              <>

                

              </>
              :
              ''
            }
            </div>
            
            {/* <img src="https://moonshine.b-cdn.net/msweb/asusaicamera/images/header_right.gif" alt="" className='max-w-screen w-1/2 md:w-auto md:h-full ml-auto order-1 md:order-2 ' /> */}
          </div>

          <div 
            className={`${isMobile ? "h-full ":  "" } flex flex-col w-full mx-auto  items-center md:mt-0 relative `}
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
                key={'ic0'+index}
                onMouseMove={(e) => handleMouseMove(e)} 
                className={`absolute`}
                style={{
                  top:`${isMobile ? image.mobile.top : image.top }`,
                  left:`${isMobile ? image.mobile.left :image.left}`,
                  width:`${isMobile ? image.mobile.width :image.width}`,
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