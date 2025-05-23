import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const AdSlider = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const sliderRef = useRef();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/ads");
        setAds(res.data);
      } catch (err) {
        console.error("광고 불러오기 실패:", err);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [ads]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  if (ads.length === 0) return null;

  return (
    <div className="relative w-full aspect-video bg-black mb-8 overflow-hidden">
      {/* 왼쪽 버튼 */}
      <button
        className="absolute left-2 top-1/2 z-20 transform -translate-y-1/2 text-white text-3xl"
        onClick={handlePrev}
      >
        ◀
      </button>

      {/* 오른쪽 버튼 */}
      <button
        className="absolute right-2 top-1/2 z-20 transform -translate-y-1/2 text-white text-3xl"
        onClick={handleNext}
      >
        ▶
      </button>

      <div
        className="flex transition-transform duration-700 h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${ads.length * 100}%`,
        }}
        ref={sliderRef}
      >
        {ads.map((ad) => (
          <div
            key={ad._id}
            className="relative w-full h-full flex-shrink-0 bg-black cursor-pointer"
            onClick={() => navigate(`/product/${ad.product?._id}`)}
          >
            <video
              src={`${import.meta.env.VITE_SERVER_URL}/ads/${ad.video}`}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="max-w-full max-h-full object-contain"
            />

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdSlider;
