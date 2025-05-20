// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import ImageSlider from "../../../components/ImageSlider";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axiosInstance, { setCsrfToken } from "../../../utils/axios";
// import { useSelector } from "react-redux";
// import { FaStar } from "react-icons/fa";

// const serverUrl = import.meta.env.VITE_SERVER_URL;

// const CardItem = ({ product, refreshWishlist }) => {
//     const user = useSelector((state) => state.user);
//     const navigate = useNavigate();

//     const [wished, setWished] = useState(false);
//     const [ready, setReady] = useState(false); 

//     const imageUrls = product.images?.map(
//     (imageName) => `${serverUrl}/uploads/${imageName}`
//   ) || [];

//     useEffect(() => {
//         if (user.isAuth && Array.isArray(user.userData?.wishlist)) {
//             setWished(user.userData.wishlist.includes(product._id));
//         }
//         setReady(true); 
//     }, [user.userData?.wishlist, user.isAuth, product._id]);

//     const handleToggleWish = async (e) => {
//         e.preventDefault();

//         if (!ready) return;

//         if (!user.isAuth) {
//             return navigate("/login");
//         }

//         try {
//             await setCsrfToken();

//             if (wished) {
//                 await axiosInstance.delete("/users/wishlist", {
//                     params: { productId: product._id },
//                 });
//                 setWished(false);
//             } else {
//                 await axiosInstance.post("/users/wishlist", {
//                     productId: product._id,
//                 });
//                 setWished(true);
//             }

//             if (refreshWishlist) refreshWishlist();
//         } catch (err) {
//             const msg = err.response?.data?.message || err.message;
//             console.error("찜 처리 실패:", msg);
//             if (msg === "이미 찜한 상품입니다.") {
//                 setWished(true);
//             }
//             alert(msg);
//         }
//     };

//     return (
//         <div className="relative border-[1px] border-gray-300">
//             {/* <ImageSlider images={product.images} /> */}
// <ImageSlider images={imageUrls} />

//             {ready && (
//                 <button
//                     onClick={handleToggleWish}
//                     disabled={!ready} 
//                     className="absolute top-2 right-2 text-red-500 text-xl z-10"
//                 >
//                     {wished ? <FaHeart /> : <FaRegHeart />}
//                 </button>
//             )}

//             <Link to={`/product/${product._id}`}>
//                 <p className="p-1">{product.title}</p>
//                 <p className="p-1">{product.continents}</p>
//                 <p className="p-1 text-xs text-gray-500">{product.price}원</p>
//             </Link>
//         </div>
//     );
// };

// export default CardItem;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "../../../components/ImageSlider";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import axiosInstance, { setCsrfToken } from "../../../utils/axios";
import { useSelector } from "react-redux";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const CardItem = ({ product, refreshWishlist }) => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [wished, setWished] = useState(false);
    const [ready, setReady] = useState(false); 

    const imageUrls =
        product.images?.map(
            (imageName) => `${serverUrl}/uploads/${imageName}`
        ) || [];

    useEffect(() => {
        if (user.isAuth && Array.isArray(user.userData?.wishlist)) {
            setWished(user.userData.wishlist.includes(product._id));
        }
        setReady(true);
    }, [user.userData?.wishlist, user.isAuth, product._id]);

    const handleToggleWish = async (e) => {
        e.preventDefault();

        if (!ready) return;

        if (!user.isAuth) {
            return navigate("/login");
        }

        try {
            await setCsrfToken();

            if (wished) {
                await axiosInstance.delete("/users/wishlist", {
                    params: { productId: product._id },
                });
                setWished(false);
            } else {
                await axiosInstance.post("/users/wishlist", {
                    productId: product._id,
                });
                setWished(true);
            }

            if (refreshWishlist) refreshWishlist();
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            console.error("찜 처리 실패:", msg);
            if (msg === "이미 찜한 상품입니다.") {
                setWished(true);
            }
            alert(msg);
        }
    };

    return (
        <div className="relative border-[1px] border-gray-300 rounded-md overflow-hidden">
            <ImageSlider images={imageUrls} />

            {ready && (
                <button
                    onClick={handleToggleWish}
                    disabled={!ready}
                    className="absolute top-2 right-2 text-red-500 text-xl z-10"
                >
                    {wished ? <FaHeart /> : <FaRegHeart />}
                </button>
            )}

            <Link to={`/product/${product._id}`}>
                <div className="p-2 space-y-1">
                    <p className="font-semibold">{product.title}</p>

                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <FaStar />
                        <span>{product.averageRating ?? "0.0"}</span>
                    </div>

                    <p className="text-sm text-gray-700">{product.price}원</p>
                </div>
            </Link>
        </div>
    );
};

export default CardItem;

