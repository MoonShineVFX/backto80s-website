import React, { useState } from 'react'
import { motion,useMotionValue,useSpring,useTransform } from 'framer-motion';
function TiltCard({imgUrl}) {

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(
      mouseYSpring, 
      [-0.5,0.5] , 
      ["12.5deg","-12.5deg"])
  const rotateY = useTransform(
      mouseXSpring, 
      [-0.5,0.5] , 
      ["-12.5deg","12.5deg"])
  
  const xOffset = useTransform(x, [-1, 1], ['-10px', '10px']); 
  const yOffset = useTransform(y, [-1, 1], ['-10px', '10px']);
  

  const onMouseMove = (e) => {
    const { clientX, clientY, target } = e;
    const { left, top, width, height } = target.getBoundingClientRect();

    const mouseX = clientX - left
    const mouseY = clientY - top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)


  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_01.png

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle:"preserve-3d",
      }}
      className=" relative rounded-xl"
    >       

      <motion.div
        className=' absolute top-0 left-0 pointer-events-none transition-all grid grid-cols-2 gap-2 w-full'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(50px) `
        }}
      >
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_01.png" alt="" className='max-w-full w-[60%] mx-auto my-auto' />
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_02.png" alt="" className='max-w-full w-[80%] mx-auto my-auto' />
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_03.png" alt="" className='max-w-full w-[80%] mx-auto my-auto' />
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_04.png" alt="" className='max-w-full w-[80%] mx-auto my-auto' />
      </motion.div>

      <motion.div
        className=' absolute -top-2 right-1/4  pointer-events-none transition-all'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(66px) rotate(-5deg) `
          
        }}
      >
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:0 }}
            exit={{ opacity: 0 , translateY:-50 }}
            transition={{ delay: 1 }}
            className='   bg-gradient-to-r from-[#FF0050] to-[#FF0050] rounded-full  px-2 text-sm right-14 z-10 drop-shadow '>
              Start Creating,Now!
              <div 
              className=' absolute w-0 h-0 border-l-[5px] border-l-transparent
              border-t-[8px] border-t-[#FF0050]
              border-r-[5px] border-r-transparent '
              ></div>
          </motion.div>
      </motion.div>

      <motion.div
        style={{
          transform:"translateZ(15px)",
          transformStyle:"preserve-3d"
        }}
        className="hover:brightness-110 transition-all duration-500 " 
      >
        {/* 卡片内容 */}

        
        <img src={imgUrl} alt="" />


      </motion.div>
    </motion.div>
  )
}

export default TiltCard