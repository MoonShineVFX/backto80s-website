import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

function Result({
  open,
  handleOpen,
  taskStatus,
  handleDownload,
  isCompressing,
  isResultComplete,
}) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  // 新增上傳函數
  const handleUpload = async () => {
    if (!selectedImage) {
      alert("請先選擇一張圖片");
      return;
    }

    try {
      setUploading(true);

      // 將 base64 圖片轉換為 Blob
      const base64Response = await fetch(selectedImage);
      const blob = await base64Response.blob();

      // 準備上傳資料
      const formData = new FormData();
      formData.append("source_image", blob);
      formData.append("prefix", "backto80");

      // 發送上傳請求
      let apiurl = "https://backto80s-api.rd-02f.workers.dev/";
      const response = await fetch(
        "https://backto80s-api.rd-02f.workers.dev/upload",
        {
          method: "POST",
          headers: {
            Authorization: `${process.env.REACT_APP_APITOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("上傳失敗");

      const data = await response.json();
      console.log("上傳成功：", data.uri);
      if (window.confirm("上傳成功！可以準備領卡片了？")) {
        navigate("/"); // 導航到首頁
      }
    } catch (error) {
      console.error("上傳錯誤：", error);
      alert("上傳失敗，請稍後再試");
    } finally {
      setUploading(false);
    }
  };

  // 新增處理 QR Code 顯示的函式
  const handleShowQRCode = () => {
    if (selectedImage) {
      console.log("選擇的圖片 URL:", selectedImage);
      setQrCodeOpen(true);
    }
  };

  // QR Code 彈窗組件
  const QRCodeDialog = () => (
    <Dialog
      open={qrCodeOpen}
      handler={() => setQrCodeOpen(false)}
      size="xs"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogBody className="flex flex-col items-center gap-4 p-4">
        <h2 className="text-xl font-bold text-[#FF0050]">掃描 QR Code</h2>
        <QRCodeSVG value={selectedImage || ""} size={200} level="H" />
        <p className="text-sm text-gray-600 text-center mt-2">
          掃描 QR Code 以取得圖片
        </p>
        <button
          onClick={() => setQrCodeOpen(false)}
          className="mt-4 px-6 py-2 bg-[#FF0050] text-white rounded-full hover:bg-[#d6004a] transition-colors"
        >
          關閉
        </button>
      </DialogBody>
    </Dialog>
  );

  const downloadImage = (imgurl) => {
    const imageUrl = imgurl;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "downloaded-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadImageBlob = (imgurl) => {
    const imageUrl = imgurl;

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "downloaded-image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("下載失敗：", error));
  };
  return (
    <div>
      <Dialog
        open={open}
        size="xxl"
        className="bg-white/80 pt-0 overflow-hidden "
      >
        <DialogHeader className="justify-end mb-0 md:mb-1">
          <IconButton variant="text" onClick={handleOpen}>
            <FaXmark size={30} />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-0 m-0 overflow-y-auto h-5/6">
          <div className="flex flex-col md:flex-col justify-center items-center gap-0 w-10/12 mx-auto  ">
            {Object.keys(taskStatus).length > 0 && (
              <div className="relative my-4 md:pt-[5%]">
                <Suspense fallback={<Spinner />}>
                  <div className="md:hidden text-center  mb-2 text-[#FF0050] font-cachet font-bold">
                    Press and hold to save photo↓
                  </div>
                  <div className=" mx-auto relative mt-5 md:mt-0 grid gap-4 grid-cols-2 md:grid-cols-4 px-5">
                    {Object.keys(taskStatus).length > 0 ? (
                      taskStatus.map((item, index) => {
                        if (item.finished === 1) {
                          return (
                            <div
                              key={"finish" + index}
                              className={`flex flex-col justify-center items-center relative transition-all group hover:-translate-y-2 cursor-pointer ${
                                selectedImage === item.img
                                  ? "ring-4 ring-[#FF0050] rounded-xl"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedImage(item.img);
                                handleShowQRCode(); // 選擇圖片後直接顯示 QR Code
                              }}
                            >
                              <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                src={item.img}
                                alt=""
                                className="rounded-xl"
                              />
                            </div>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <div>no result or fail</div>
                    )}
                  </div>
                  <div className="  flex flex-col justify-center  items-center mt-10">
                    <div>你可以選擇一張喜歡的圖片列印成卡片</div>
                    {/* <div className="text-[#FF0050]">
                      {selectedImage ? "已選擇 1 張圖片" : "尚未選擇圖片"}
                    </div> */}
                    {/* {selectedImage && (
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`mt-4 px-6 py-2 rounded-full transition-colors ${
                          uploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#FF0050] hover:bg-[#d6004a]"
                        } text-white`}
                      >
                        {uploading ? "上傳中..." : "上傳"}
                      </button>
                    )} */}
                  </div>
                </Suspense>
              </div>
            )}

            <div className="flex justify-start flex-col    gap-2 md:gap-8 mt-0 md:mt-0 w-full hidden ">
              <div className="flex relative h-10 lg:h-14 justify-center hidden ">
                <img
                  src={process.env.PUBLIC_URL + "/images/btn_download.png"}
                  alt=""
                  className={`${
                    isResultComplete ? "grayscale-0 " : "grayscale "
                  } h-full transition-all cursor-pointer hover:-translate-y-1`}
                  onClick={isResultComplete ? handleDownload : undefined}
                />
                {isCompressing && (
                  <div className="text-center flex items-center justify-center gap-2 ">
                    <FiLoader className="animate-spin" />
                    Compressing..{" "}
                  </div>
                )}
              </div>
              {/* <div className=" relative   h-full cursor-pointer hover:-translate-y-1 transition-all hidden" onClick={handleOpen}>
                  <img src={process.env.PUBLIC_URL+'/images/btn_redraw.png'} alt=""  className="h-full"/>
                </div>
                <Link to='/camera' className=" relative mt-2 md:mt-0   h-full hover:-translate-y-1 transition-all hidden" onClick={handleOpen}>
                  <img src={process.env.PUBLIC_URL+'/images/btn_reshoot.png'} alt=""  className="h-full"/>
                </Link> */}
              <div className="flex relative h-10 lg:h-14 justify-center hidden ">
                <Link
                  to="/"
                  className=" relative mt-2 md:mt-0   h-full hover:-translate-y-1 transition-all"
                >
                  <img
                    src={process.env.PUBLIC_URL + "/images/btn_home.png"}
                    alt=""
                    className="h-full"
                  />
                </Link>
              </div>
            </div>
          </div>
        </DialogBody>
      </Dialog>

      {/* QR Code 彈窗 */}
      <QRCodeDialog />
    </div>
  );
}

export default Result;
