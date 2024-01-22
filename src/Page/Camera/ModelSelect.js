import React, { useState, useRef, useEffect, Suspense } from 'react'
import Result from './Result';
import { useImage } from '../../Helper/ImageContext';
import { Link } from "react-router-dom";
import { Button,Checkbox,Typography,Spinner } from "@material-tailwind/react";
import { FaArrowLeft,FaCameraRetro,FaCheck } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import {getUsernameFromCookie,getRandomUniqueNumbers} from '../../Helper/Helper'
import Resizer from "react-image-file-resizer";
import TiltCard from '../Components/TiltCard';
import JSZip from 'jszip';
const bannerData = [
  {url:"https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/template01.png" ,title:'MODULE 1', subtitle:"Introduction to module one",id:'1'},
  {url:"https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/template02.png" ,title:'MODULE 2', subtitle:"Introduction to module two",id:'2'},
  {url:"https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/template03.png" ,title:'MODULE 3', subtitle:"Introduction to module three",id:'3'},
  {url:"https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/template04.png" ,title:'MODULE 4', subtitle:"Introduction to module four",id:'4'},

 ]
 let corsURL = 'https://mscors-anywhwere.kilokingw.workers.dev/?'
 let apiurl = 'https://backto80s-api.rd-02f.workers.dev/'
 let face_swap_url = apiurl + 'face_swap'
 let getimages_url =  apiurl + 'images/'
function ModelSelect() {
  const storedUsername = getUsernameFromCookie();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCompressing , setIsCompressing] = useState(false)
  const [isResultComplete,setIsResultComplete]= useState(false)
  const [sourceImage ,setSourceImage ] = useState(null)
  const [taskStatus, setTaskStatus] = useState([
    {
      status: 'ok',
      id: null,
      img: 'https://r2.web.moonshine.tw/msweb/backto80s_ai/template_80s/49.jpg',
      finished: 1,
    },
    {
      status: 'ok',
      id: null,
      img: 'https://r2.web.moonshine.tw/msweb/backto80s_ai/template_80s/50.jpg',
      finished: 1,
    },
    {
      status: 'Waiting for Result...',
      id: null,
      img: 'https://r2.web.moonshine.tw/msweb/backto80s_ai/template_80s/49.jpg',
      finished: 0,
    } ,
    {
      status: 'Waiting for Result...',
      id: null,
      img: 'https://r2.web.moonshine.tw/msweb/backto80s_ai/template_80s/49.jpg',
      finished: 0,
    }
  ]); 

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const { beforeImage } = useImage();
  const [swiper, setSwiper] = useState(null);
  const [currentId , setCurrentId] = useState('1')
  const [currentIndex , setCurrentIndex] = useState(0)
  // console.log(currentId)
  const [msg,setMsg] = useState('')
  
  const [isRender , setIsRender] = useState(false)
  const [renderedData, setRenderedData] = useState({})
  const [renderedResult, setRenderedResult] = useState({})
  const [showRender , setShowRender] = useState(false)

  const handleOpen = () => setShowRender(!showRender);
  const handleImageClick = (index) =>{
    console.log(index)
    setCurrentIndex(index)
  }
  const needsCompression = (file, maxSize, maxDimension) => {
    return file.size > maxSize || (file.width > maxDimension || file.height > maxDimension);
  }
  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          resolve({
            width: this.width,
            height: this.height,
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const onBtnClick= async ()=>{
    //todo 四個數字  1-91
    // getRandomUniqueNumbers(43,1,91)
    if (!beforeImage) {
      setMsg('Error: Image must be taken or uploaded first.')
      return
    }
    if(!currentId){
      // console.log('no')
      setMsg('Error: A mod must be selected.')
      return
    }

    try{
      setMsg(null)
      setMsg('Picture uploading…..')
      setIsRender(true)
      setIsResultComplete(false)

      const imageUrls = getRandomUniqueNumbers(4, 1, 91).map(
        (num) => `https://r2.web.moonshine.tw/msweb/backto80s_ai/template_80s/${num}.jpg`
      );
      //blob:https://web-r2.moonshine.tw/22837887-432d-4d0e-ac94-85ab193ba1b1
      console.log(imageUrls)

      // setStartRender(true)
      //fetch API 上傳運算
      //POST https://faceswap.rd-02f.workers.dev/images 上傳圖片
      //GET https://faceswap.rd-02f.workers.dev/images/<id> 取得圖片
      var file = dataURLtoFile(beforeImage,'image.jpg')
      const { width, height } = await getImageDimensions(file);
      console.log(width, height)
      
      //容量 尺寸
      let compressFiles;
      if(needsCompression(file, 1 * 1024 * 1024, 1200)) {
  
        // console.log('需要壓縮')
        setMsg('Compressing image.')
        compressFiles = await resizeFile(file);
        await setSourceImage(compressFiles)
      }else{
        compressFiles = file
        await setSourceImage(compressFiles)
      }

      await uploadAndAwaitResult(imageUrls,compressFiles)

    
    }catch{

    }
  }
  //TODO 
  const uploadAndAwaitResult = async (imageUrls,compressFiles)=>{
    const statusList = imageUrls.map((imageUrl) => ({
      status: 'Uploading...',
      id: null,
      img: '',
      finished: 0,
    }));
    let counterIndex = 0
    const uploadPromises = imageUrls.map((imageUrl,index) => {
      return new Promise(async (resolve, reject) => {
        try {
          // 上传图像的逻辑
          const formData = new FormData();
          formData.append('source_image', compressFiles);
          formData.append('swap_image_url', imageUrl);
          var myHeaders = new Headers();
          myHeaders.append("Authorization", process.env.REACT_APP_APITOKEN);
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow',
          };
          const response = await fetch(corsURL+face_swap_url,requestOptions);
          if (!response.ok) {
            setMsg('Error:please upload the image again.')
            reject(new Error('Image upload failed.'));
            return;
          }
  
          const responseData = await response.json();
          console.log(responseData);
          
  
          if (responseData.message) {
            setMsg('Error:please upload the image again.')
            reject(new Error('Image upload failed.'));
            return;
          }
          if(responseData.id){
            counterIndex++
            setMsg(`Flow task ${counterIndex}/${imageUrls.length} uploaded`)
          }

          // 上传成功，等待结果
          await new Promise((innerResolve) => setTimeout(innerResolve, 300));
          
          statusList[index].status = 'Image uploaded, Waiting for result...';
          statusList[index].id = responseData.id;

          resolve(responseData);
        } catch (error) {
          setMsg('Error: Image upload failed.');
          reject(error);
        }
      });
    });
  
    try {
      setTaskStatus(statusList);

      const results = await Promise.all(uploadPromises);
      console.log('All uploads completed:', results);
      // 在这里处理所有上传任务完成后的逻辑
      const taskStatusList = [...statusList];
        setShowRender(true)
        setIsRender(false)
      console.log(statusList)

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const status = taskStatusList[i];
    
        if (result && result.id) {
          // 调用 getResulImage，注意传入对应的 id 和 sourceImg
          // 不再直接更新状态，而是调用递归函数处理
          processTasks(taskStatusList, i);
        }
      }      

    } catch (error) {
      console.error('Upload error:', error);
      // 在这里处理上传过程中的错误
    }


  }
  // 送出時 一一上傳四張模組 等於有四個任務id  依序拿圖
  const processTasks = async (tasks, index) => {
    if (index >= tasks.length) {
      // 所有任务都已处理完毕，退出递归
      console.log('完成了',tasks.length , index)
      setIsResultComplete(true)
    
      return;
    }
  
    const task = tasks[index];
    const resultImage = await getResulImage(task.id);
    if (resultImage.restarted>=2){
      setMsg('Timeout error, please upload the image again.')
      return
    }
    if (resultImage.finished === 0) {
      // 如果沒有 source_image，一段時間再嘗試
      setTimeout(() => {
        processTasks(tasks, index);
      }, 1500); // 假设间隔为1秒，你可以根据需要调整
    } else {
      // 更新任務狀態
      task.finished = 1;
      task.img = resultImage.generations[0].img;
      task.status = 'Result received';
      setTaskStatus([...tasks]);
  
      // 處理下一任務
      processTasks(tasks, index + 1);
    }
  };

  let source;
  const getResulImage =  async (id) =>{
    try {
      const response = await fetch(corsURL+getimages_url+ id, {
        method: 'GET',
        headers: {
          'Authorization':process.env.REACT_APP_APITOKEN
        }
      });
      const responseData = await response.json();
  
      // 在此处返回 responseData
      return responseData;
    } catch (error) {
      console.error(error);
      // 返回一个错误或默认值，取决于你的需求
      return { error: 'An error occurred' };
    }
  
  }
  const updatedData = async (id,url,sourceImage)=>{
    console.log(sourceImage)
    const formData = new FormData();
    formData.append('source_image', sourceImage); 
    formData.append('swap_image', url); 
    formData.append("horde_id", id);
    formData.append("username", storedUsername ? storedUsername : ' ');
    formData.append("command_type", currentId);

    await fetch(apiurl+'swap_data', {
      method: 'POST',
      body: formData,
      redirect: 'follow',
      headers: {
        'Authorization':process.env.REACT_APP_APITOKEN
      }
    })
    .then(response => {
      if(response.status === 200){
        console.log('uploaded')
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
  const resizeFile = (file) => 
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000, // 設置圖像的最大寬度
        1000, // 設置圖像的最大高度
        'JPEG', // 設置圖像的格式
        70, // 設置圖像的質量
        0, // 設置圖像的旋轉角度
        (uri) => {
          resolve(uri);
        },
        'file' // 設置返回的圖像格式
      );
    });
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
  useEffect(() => {
    // 這個 effect 會在 sourceImage 更新後執行
    console.log('sourceImage 更新了:', sourceImage);

    // 在這裡執行其他你想要的邏輯...
  }, [sourceImage]); // 設定 sourceImage 為 effect 的依賴


  //處理圖片打包下載壓縮檔
  const handleDownload = async()=>{
    const addImagePromises = [];
    setIsCompressing(true)
    for (let index = 0; index < taskStatus.length; index++) {
      const task = taskStatus[index];
      if (task.finished === 1 && task.img) {
        // 提取图片文件名，可以根据需要修改文件名
        const filename = `${'img'+index}.jpg`;
        addImagePromises.push(fetchAndAddImageToZip(task.img, filename));
      }
    }
    console.log(taskStatus)


    try {
      // 使用 Promise.all 等待所有图片添加操作完成
      await Promise.all(addImagePromises);
      setIsCompressing(false)
      // 所有图片已添加，现在可以生成 zip 文件
      const content = await zip.generateAsync({ type: 'blob' });
  
      // 创建一个可下载的链接
      const url = window.URL.createObjectURL(content);
  
      // 创建一个下载链接元素
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.zip'; // 设置下载文件的名称
  
      // 模拟点击下载链接
      a.click();
  
      // 释放 URL 对象
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error while handling download:', error);
    }
  }
  const zip = new JSZip();
  const fetchAndAddImageToZip = async (imageUrl, filename) => {
    
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const imageData = await response.blob();
        const imageFile = new File([imageData], filename);
        console.log(imageFile)
        zip.file(filename, imageFile);
      } else {
        console.error(`Failed to fetch image from ${imageUrl}`);
      }
    } catch (error) {
      console.error(`Error fetching image from ${imageUrl}: ${error.message}`);
    }
  };
  
  return (
    <div className="flex flex-col justify-between items-center  w-full h-full my-10 md:my-0 md:mt-4">
      

      {beforeImage?
        <Suspense fallback={<p>Loading</p>}>
          <motion.div 
            initial={{ opacity: 0 , translateY:-50}}
            animate={{ opacity: 1 , translateY:10}}
            exit={{ opacity: 0 , translateY:-50 }}
            className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-10 hidden">
            <div className="text-sm">你的圖片：</div> 
            <div className="w-full h-full  ">
              <img src={beforeImage} alt="Selected"  className="max-w-full w-full h-auto border-2 border-white rounded-md object-contain " />

            </div>
            {/* 在这里可以进行图像上传或其他操作 */}
          </motion.div>
        </Suspense>
        :
        <div className="w-[160px] aspect-video flex flex-col mx-auto fixed top-5 right-5 text-xs">Remember to upload a photo</div>
      }
        <motion.div 
          className='  text-gray-200 w-full md:w-8/12 lg:w-7/12 mx-auto z-20 '
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <Link to='/' className=" " >
            <Button variant="text" className="flex items-center gap-3 text-[#FF3976] p-0 mb-2 text-2xl font-extrabold  mt-2 drop-shadow-[0_0.8px_0.1px_rgba(0,0,0,0.8)]">
              <FaArrowLeft size={15} className='ml-2' />
              Back 
            </Button>
          </Link>

          <img src="https://r2.web.moonshine.tw/msweb/backto80s_ai/logo.png" alt="" />

        </motion.div>
        <div className='w-[84%] md:w-6/12 lg:w-4/12 mx-auto relative mt-10 cursor-pointer'>

          <div 
            className={ ' relative w-full transition-all duration-1000' }
            onClick={onBtnClick}
          >
            <TiltCard 
              imgUrl='https://r2.web.moonshine.tw/msweb/backto80s_ai/templates/btn_create3.png'
            />
          </div>
        </div>
        {beforeImage? 
          <div className=" ">
          </div>
          :
          <div className=" relative mt-8 md:mt-4 cursor-default" >
            <div className='bg-[#FF3976]/80  px-10 py-2 border  border-white/30 flex items-center gap-2  font-roboto' >No images found for operation.</div>
            <div className='text-sm font-normal text-[#FF3976] text-center mt-3'>Please take a new photo or upload the image.</div>
          </div>
        }


        {isRender && 
          <div className='fixed  inset-0 w-full h-screen bg-white/50 z-30 backdrop-blur-sm'>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            className=' absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'
          >
            <div className='w-full  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
              <img src={process.env.PUBLIC_URL+'/images/icon_ ribbon02.png'} alt="" className=''/>
            </div>
            


            <div className='mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <div className=' relative w-[75%] md:w-[280px] mt-[45%] mx-auto '>
                <motion.img 
                  initial={{ opacity: 0,y:10 }}
                  animate={{ opacity: 1,y:0}}
                  exit={{ opacity: 0,y:10}} src={bannerData[currentIndex].url} alt="Selected"  className=" max-w-full h-fulll  " />
              </div>
              <div className=' relative left-1/2 -translate-x-1/2  z-40 w-full text-center '>
                  {msg && !msg.includes('Error') && (
                    <motion.div 
                      initial={{ opacity: 0,y:10 }}
                      animate={{ opacity: 1,y:0}}
                      exit={{ opacity: 0,y:10}}
                      className='text-[#FF0050] md:text-2xl font-extrabold  mt-4 drop-shadow-[0_0.8px_0.1px_rgba(0,0,0,0.8)]'>
                        {msg}

                        <div className='md:w-1/2 flex gap-2 items-center justify-center mx-auto mt-4'>
                          <div className=' relative'>
                            <img src={process.env.PUBLIC_URL+'/images/loading-1.png'} alt="" className='w-full' />
                            <img src={process.env.PUBLIC_URL+'/images/loading-2.png'} alt="" className='w-full absolute top-0 animate-[fadeInOut_3s_ease-in-out_infinite] ' />
                          </div>
                          <div className=' relative'>
                            <img src={process.env.PUBLIC_URL+'/images/loading-1.png'} alt="" className='w-full' />
                            <img src={process.env.PUBLIC_URL+'/images/loading-2.png'} alt="" className='w-full absolute top-0 animate-[fadeInOut_3s_ease-in-out_infinite] ' style={{animationDelay:'200ms'}} />
                          </div>
                          <div className=' relative'>
                            <img src={process.env.PUBLIC_URL+'/images/loading-1.png'} alt="" className='w-full' />
                            <img src={process.env.PUBLIC_URL+'/images/loading-2.png'} alt="" className='w-full absolute top-0 animate-[fadeInOut_3s_ease-in-out_infinite] ' style={{animationDelay:'400ms'}} />
                          </div>
                          <div className=' relative'>
                            <img src={process.env.PUBLIC_URL+'/images/loading-1.png'} alt="" className='w-full' />
                            <img src={process.env.PUBLIC_URL+'/images/loading-2.png'} alt="" className='w-full absolute top-0 animate-[fadeInOut_3s_ease-in-out_infinite] ' style={{animationDelay:'600ms'}} />
                          </div>
                          <div className=' relative'>
                            <img src={process.env.PUBLIC_URL+'/images/loading-1.png'} alt="" className='w-full' />
                            <img src={process.env.PUBLIC_URL+'/images/loading-2.png'} alt="" className='w-full absolute top-0 animate-[fadeInOut_3s_ease-in-out_infinite] ' style={{animationDelay:'800ms'}} />
                          </div>
                          

                        </div>
                      </motion.div>
                  )}

                  {
                    msg && msg.includes('Error') &&
                      <div  className='mt-4 p-2 /70 flex flex-col items-center'>
                        <div className='text-[#FF0050] text-lg md:text-2xl font-extrabold  mt-4 drop-shadow-[0_0.8px_0.1px_rgba(0,0,0,0.8)] '>{msg}</div>
                        <div className='md:text-lg  text-[#FF0050] mt-2'>Unsupported format or unclear image.</div>
                        <Link to='/camera' className=' px-3  py-2 text-xs text-[#FFf] rounded-lg border-white/50 my-3 bg-[#FF0050]/20 hover:bg-[#FF0050]/40 font-roboto '>Back</Link> 
                      </div>
                  }

                </div>
            </div>

          </motion.div>
        
          </div>
        }

        
      
      <Result open={showRender} handleOpen={handleOpen} taskStatus={taskStatus} handleDownload={handleDownload} isCompressing={isCompressing} isResultComplete={isResultComplete}/>
      
    </div>
  )
}

export default ModelSelect