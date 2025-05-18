// 📁 src/pages/WishlistPage/index.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);

    const fetchWishlist = async () => {
        try {
            const res = await axiosInstance.get("/users/wishlist");
            setWishlist(res.data.products);
        } catch (error) {
            console.error("찜 목록 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <section className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                찜한 상품
            </h2>

            {Array.isArray(wishlist) && wishlist.length === 0 ? (
                <p className="text-center text-gray-500">
                    찜한 상품이 없습니다.
                </p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist?.map((product) => (
                        <li
                            key={product._id}
                            className="border rounded-md shadow"
                        >
                            <img
                                src={`http://localhost:4000/uploads/${product.images[0]}`}
                                alt={product.title}
                                className="w-full h-48 object-cover rounded-t"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-1">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-700 mb-1">
                                    ₩{product.price.toLocaleString()}
                                </p>
                                <Link
                                    to={`/product/${product._id}`}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    상세보기
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default WishlistPage;
