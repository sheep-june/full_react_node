import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../store/thunkFunctions";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { setCsrfToken } from "../../../utils/axios";

const NavItem = ({ mobile }) => {
    const isAuth = useSelector((state) => state.user?.isAuth);
    const cart = useSelector((state) => state.user?.userData?.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await setCsrfToken();
            await dispatch(logoutUser());
            navigate("/login");
        } catch (err) {
            console.error("로그아웃 실패:", err);
        }
    };

    if (!isAuth) {
        return (
            <ul
                className={`text-md w-full flex gap-4 ${
                    mobile ? "flex-col bg-gray-900" : ""
                } items-center justify-center`}
            >
                <li>
                    <Link to="/auth">로그인</Link>
                </li>
                <li>
                    <Link to="/register">회원가입</Link>
                </li>
            </ul>
        );
    }

    return (
        <ul
            className={`text-md w-full flex gap-4 ${
                mobile ? "flex-col bg-gray-900" : ""
            } items-center justify-center`}
        >
            <li className="relative">
                <Link to="/user/cart">
                    <AiOutlineShoppingCart className="text-xl" />
                    <span className="absolute top-0 -right-2 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {cart?.length}
                    </span>
                </Link>
            </li>
            <li
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
            >
                <button className="px-4 py-2 text-[#00C4C4] hover:underline">
                    마이페이지
                </button>

                {dropdownOpen && (
                    <ul className="absolute top-full right-0 z-20 w-40 py-2 bg-white border rounded shadow-lg text-black text-sm">
                        <li className="px-4 py-2 hover:bg-gray-100">
                            <Link to="/history">주문 목록</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100">
                            <Link to="/product/upload">업로드</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100">
                            <Link to="/user/myproducts">내가 올린 상품</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100">
                            <Link to="/user/wishlist">찜 목록</Link>
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </li>
                    </ul>
                )}
            </li>
        </ul>
    );
};

export default NavItem;
