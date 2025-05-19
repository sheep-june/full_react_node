import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/thunkFunctions";
import axiosInstance from "../../../utils/axios";

const ProductInfo = ({ product }) => {
    const dispatch = useDispatch();

    const handleCartClick = () => {
        dispatch(addToCart({ productId: product._id }));
    };

    const handleWishlistClick = async () => {
        try {
            const res = await axiosInstance.post("/users/wishlist", {
                productId: product._id,
            });
            alert("찜 목록에 추가되었습니다.");
        } catch (error) {
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("찜하기에 실패했습니다.");
            }
        }
    };

    return (
        <div>
            <p className="text-xl text-bold">상품 정보</p>
            <ul>
                <li>
                    <span className="font-semibold text-gray-900">가격:</span>{" "}
                    {product.price} 원
                </li>
                <li>
                    <span className="font-semibold text-gray-900">
                        팔린 개수:
                    </span>{" "}
                    {product.sold} 개
                </li>
            </ul>

            <div className="mt-3 flex space-x-2">
                <button
                    onClick={handleCartClick}
                    className="w-1/2 px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700"
                >
                    장바구니로
                </button>
                <button
                    onClick={handleWishlistClick}
                    className="w-1/2 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                    찜하기
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
