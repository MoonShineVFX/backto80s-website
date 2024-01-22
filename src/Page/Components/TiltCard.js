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
        className='w-24 absolute top-5 left-5  pointer-events-none'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(30px) `
          
        }}
      >
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_01.png" alt="" />
      </motion.div>
      <motion.div
        className='w-24 absolute top-5 right-5  pointer-events-none'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(40px) `
          
        }}
      >
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_02.png" alt="" />
      </motion.div>
      <motion.div
        className='w-24 absolute bottom-10 leftt-10  pointer-events-none'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(40px) `
          
        }}
      >
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_03.png" alt="" />
      </motion.div>
      <motion.div
        className='w-24 absolute bottom-10 right-10  pointer-events-none'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(50px) `
          
        }}
      >
        <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_c_04.png" alt="" />
      </motion.div>
      <motion.div
        className=' absolute top-0 right-1  pointer-events-none'
        style={{
          xOffset,
          yOffset,
          transform: `translateZ(46px) `
          
        }}
      >
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:0}}
            exit={{ opacity: 0 , translateY:-50 }}
            transition={{ delay: 1 }}
            className='   bg-gradient-to-r from-[#FF0050] to-[#FF0050] rounded-full  px-2 text-sm right-14 z-10 drop-shadow'>
              Start Creating!
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