import React,{Suspense} from 'react'
import { Link } from "react-router-dom";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
  IconButton
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
function Result({open ,handleOpen,taskStatus,handleDownload,isCompressing,isResultComplete}) {

  const downloadImage = (imgurl) => {
    const imageUrl = imgurl
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'downloaded-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadImageBlob = (imgurl) => {
    const imageUrl = imgurl;
  
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'downloaded-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error('下載失敗：', error));
  };
  return (
    <div>
      <Dialog open={open} size="xxl"  className='bg-white/80 pt-0 overflow-hidden '>
      <DialogHeader className="justify-end mb-0 md:mb-1">
          <IconButton
            variant="text"
            onClick={handleOpen}
          >
            <FaXmark size={30} />
          </IconButton>
        </DialogHeader>
        <DialogBody className='p-0 m-0 overflow-y-auto h-5/6'>
          <div className='flex flex-col md:flex-col justify-center items-center gap-0 w-10/12 mx-auto  '>

            {Object.keys(taskStatus).length > 0 && (
              <div className='relative my-10 md:pt-[5%]'>
                <Suspense fallback={<Spinner/>}>
                  <div className='md:hidden text-center  mb-2 text-[#FF0050] font-cachet font-bold'>Press and hold to save photo↓</div>
                  <div className=' mx-auto relative mt-5 md:mt-0 grid gap-4 grid-cols-2 md:grid-cols-4 px-5'>
                    {Object.keys(taskStatus).length > 0 ?
              
                      taskStatus.map((item,index)=>{
                        if(item.finished === 0){
                          return(
                            <div key={'not'+index} className='flex flex-col justify-center items-center  '>
                              <div className='w-full h-full  relative  overflow-hidden rounded-xl  '>
                                <div className='w-full h-full bg-[#fbabc4] z-0  aspect-[127/158] '></div>
                                <div 
                                  className=" z-10 absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#f57ea3] to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
                                >
                                </div>
                              </div>
                              <motion.div 
                                initial={{ opacity: 0,y:10 }}
                                animate={{ opacity: 1,y:0}}
                                exit={{ opacity: 0,y:10}}
                              >
                                {item.status}
                              </motion.div>
                            </div>
                          )
                        }else{
                          return(
                            <a 
                              key={'finish'+index} 
                              className='flex flex-col justify-center items-center relative transition-all group hover:-translate-y-2  '
                              href={item.img}
                              target='_blank'
                            > 
                              <div className=' absolute top-3 right-3 transition-all opacity-50 group-hover:opacity-100'>
                                <FaExternalLinkAlt  color='white' size={15} />
                              </div>
                             
                              <motion.img 
                                initial={{ opacity: 0}}
                                animate={{ opacity: 1}}
                                exit={{ opacity: 0}}
                                src={item.img} alt="" className='rounded-xl ' />
                              <motion.div 
                                initial={{ opacity: 0,y:10 }}
                                animate={{ opacity: 1,y:0}}
                                exit={{ opacity: 0,y:10}}
                              >
                                {item.status}
                              </motion.div>

                            </a>
                          )
                        }

                      })
                      : 
                      <div>no result or fail </div>
                    }
                  </div>


               
                </Suspense>
                
              </div>
            )}

             

              <div className='flex justify-start flex-col    gap-2 md:gap-8 mt-4 md:mt-0 w-full '>
                <div className="flex relative h-10 lg:h-14 justify-end " >
                  <img 
                    src={process.env.PUBLIC_URL+'/images/btn_download.png'} 
                    alt=""  
                    className={`${isResultComplete ? 'grayscale-0 ' : 'grayscale ' } h-full transition-all cursor-pointer hover:-translate-y-1`}
                    onClick={isResultComplete ? handleDownload : undefined}
                  />
                  {isCompressing && <div className='text-center flex items-center justify-center gap-2 '><FiLoader className='animate-spin' />Compressing..  </div>}
                </div>
                {/* <div className=" relative   h-full cursor-pointer hover:-translate-y-1 transition-all hidden" onClick={handleOpen}>
                  <img src={process.env.PUBLIC_URL+'/images/btn_redraw.png'} alt=""  className="h-full"/>
                </div>
                <Link to='/camera' className=" relative mt-2 md:mt-0   h-full hover:-translate-y-1 transition-all hidden" onClick={handleOpen}>
                  <img src={process.env.PUBLIC_URL+'/images/btn_reshoot.png'} alt=""  className="h-full"/>
                </Link> */}
                <div className="flex relative h-10 lg:h-14 justify-end ">
                  <Link to='/' className=" relative mt-2 md:mt-0   h-full hover:-translate-y-1 transition-all" >
                    <img src={process.env.PUBLIC_URL+'/images/btn_home.png'} alt=""  className="h-full"/>
                  </Link>
                </div>

              </div>

          </div>



        </DialogBody>
     
      </Dialog>
    </div>
  )
}

export default Result