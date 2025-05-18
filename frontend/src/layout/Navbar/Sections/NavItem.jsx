// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { logoutUser } from "../../../store/thunkFunctions";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { setCsrfToken } from "../../../utils/axios";

// const routes = [
//     { to: "/login", name: "로그인", auth: false },
//     { to: "/register", name: "회원가입", auth: false },
//     { to: '/product/upload', name: '업로드', auth: true },
//     { to: '/user/cart', name: '카트', auth: true, icon: <AiOutlineShoppingCart style={{ fontSize: '1.4rem' }} /> },
//     { to: "", name: "로그아웃", auth: true },
//     { to: '/history', name: '주문목록', auth: true },
// ];

// const NavItem = ({mobile}) => {
//     const isAuth = useSelector((state) => state.user?.isAuth);
//     const cart = useSelector(state => state.user?.userData?.cart);

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//     try {
//         await setCsrfToken();
//         await dispatch(logoutUser());
//         navigate("/login");
//     } catch (err) {
//         console.error("로그아웃 실패:", err);
//     }
// };

//     return (
//         <ul className={`text-md justify-center w-full flex gap-4 ${mobile && "flex-col bg-gray-900 h-full"} items-center`}>
//             {routes.map(({ to, name, auth, icon }) => {
//                 if (isAuth !== auth) return null;

//                 if (name === "로그아웃") {
//                     return (<li key={name} className="py-2 text-center border-b-4 cursor-pointer">
//                         <Link onClick={handleLogout}>{name}</Link>
//                     </li>
//                     );
//                 }
//                 else if (icon) {
//                     return <li className='relative py-2 text-center border-b-4 cursor-pointer' key={name}>
//                         <Link to={to} >
//                             {icon}
//                         <span className='absolute top-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -right-3'>
//                             {cart?.length}
//                         </span>
//                       </Link>
//                     </li>
//                 }
//                 else {
//                     return (<li key={name} className="py-2 text-center border-b-4 cursor-pointer">
//                         <Link to={to}>{name}</Link>
//                         </li>
//                     );
//                 }
//             })}
//         </ul>
//     );
// };

// export default NavItem;

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
                    <Link to="/login">로그인</Link>
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
            {/* 장바구니 */}
            <li className="relative">
                <Link to="/user/cart">
                    <AiOutlineShoppingCart className="text-xl" />
                    <span className="absolute top-0 -right-2 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {cart?.length}
                    </span>
                </Link>
            </li>

            {/* 마이페이지 전체 영역에 hover 적용 */}
            <li
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
            >
                <button className="px-4 py-2 text-white hover:underline">
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
