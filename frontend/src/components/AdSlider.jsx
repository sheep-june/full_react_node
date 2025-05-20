import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const AdSlider = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const videoRefs = useRef([]);

    // ✅ 광고 불러오기
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

    // ✅ 15초마다 자동 전환
    useEffect(() => {
        if (ads.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 16000);

        return () => clearInterval(timer);
    }, [ads]);

    // ✅ 인덱스 변경 시 재생 보장
    useEffect(() => {
        if (videoRefs.current[currentIndex]) {
            videoRefs.current[currentIndex].load();
            videoRefs.current[currentIndex].play().catch(() => {});
        }
    }, [currentIndex]);

    // ✅ 수동 이전/다음
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
    };

    if (ads.length === 0) return null;

    return (
        <div className="relative w-full h-[300px] mb-8 overflow-hidden bg-black">
            {/* ◀ 이전 버튼 */}
            <button
                className="absolute left-2 top-1/2 z-10 transform -translate-y-1/2 text-white text-3xl"
                onClick={handlePrev}
            >
                ◀
            </button>

            {/* ▶ 다음 버튼 */}
            <button
                className="absolute right-2 top-1/2 z-10 transform -translate-y-1/2 text-white text-3xl"
                onClick={handleNext}
            >
                ▶
            </button>

            {/* 광고 영상들 */}
            {ads.map((ad, index) => (
                <div
                    key={`${ad._id}_${index}`}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={() => navigate(`/product/${ad.product?._id}`)} // ✅ _id 안전 접근
                >
                    <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={`${import.meta.env.VITE_SERVER_URL}/ads/${ad.video}`}
                        className="w-full h-full object-cover cursor-pointer"
                        muted
                        autoPlay
                        loop
                        playsInline
                    />
                </div>
            ))}
        </div>
    );
};

export default AdSlider;
