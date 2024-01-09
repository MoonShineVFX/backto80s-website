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
  return (
    <motion.div
    onMouseMove={onMouseMove}
    onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle:"preserve-3d",
      }}
      className=" relativerounded-xl"

    >
      <motion.div
      style={{
        transform:"translateZ(75px)",
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