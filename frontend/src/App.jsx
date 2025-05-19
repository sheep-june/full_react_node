// import { Outlet, Route, Routes, useLocation } from "react-router-dom";
// import "./App.css";
// import LoginPage from "./pages/LoginPage";
// import LandingPage from "./pages/LandingPage";
// import RegisterPage from "./pages/RegisterPage";
// import Navbar from "./layout/Navbar";
// import Footer from "./layout/Footer";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import { authUser } from "./store/thunkFunctions";
// import { useEffect } from "react";
// import ProtectedPage from "./pages/ProtectedPage";
// import ProtectedRoutes from "./components/ProtectedRoutes";
// import NotAuthRoutes from "./components/NotAuthRoutes";
// import UploadProductPage from "./pages/UploadProductPage/index";
// import CartPage from "./pages/CartPage/index";
// import HistoryPage from "./pages/HistoryPage/index";
// import DetailProductPage from "./pages/DetailProductPage/index";
// import AdminLoginPage from "./pages/AdminLoginPage";
// import AdminProtectedRoutes from "./components/AdminProtectedRoutes";
// import AdminDashboardPage from "./pages/AdminDashboardPage";
// import MyProductsPage from "./pages/MyProductPage";
// import { setCsrfToken } from "./utils/axios";
// import WishlistPage from "./pages/WishlistPage";
// import AuthPage from "./pages/AuthPage/Index";

// function Layout() {
//     return (
//         <div className="flex flex-col h-screen justify-between">
//             {/* 전체 화면을 세로 방향으로 구성하고 위아래 공간을 적절히 분배 */}

//             <ToastContainer
//                 position="bottom-right"
//                 theme="light"
//                 pauseOnHover
//                 autoClose={1500}
//             />
//             {/* 알림 메시지 띄우는 컨테이너. 오른쪽 아래에 1.5초 간 표시됨 */}

//             <Navbar />
//             {/* 상단 네비게이션 바 (공통) */}

//             <main className="mb-auto w-10/12 max-w-4xl mx-auto">
//                 {/* 본문 영역. 중앙 정렬, 너비 제한 */}

//                 <Outlet />
//                 {/* 중첩된 Route가 여기 렌더링됨 */}
//             </main>

//             <Footer />
//             {/* 하단 푸터 (공통) */}
//         </div>
//     );
// }

// function App() {
//     const isAuth = useSelector((state) => state.user?.isAuth);
//     const { pathname } = useLocation();
//     const dispatch = useDispatch();

//     // useEffect(() => {
//     //     dispatch(authUser()); 
//     // }, [dispatch]);

//     // useEffect(() => {
//     //     if (isAuth) {
//     //         dispatch(authUser());
//     //     }
//     // }, [isAuth, pathname, dispatch]);

//     useEffect(() => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     setCsrfToken(); // CSRF 토큰도 셋팅
//     dispatch(authUser());
//   }
// }, []);


//     return (
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 {/* 루트 경로(/)는 Layout 컴포넌트를 사용. 이 안에서 Outlet으로 자식 컴포넌트를 렌더링 */}

//                 <Route index element={<LandingPage />} />
//                 {/* 기본 경로(/)는 LandingPage 컴포넌트를 렌더링 */}

//                 {/* 로그인한 사람은 접근 불가 */}
//                 <Route element={<NotAuthRoutes isAuth={isAuth} />}>
//                     {/* 로그인 또는 회원가입은 비로그인 상태에서만 접근 가능 */}
//                     <Route path="/login" element={<LoginPage />} />
//                     <Route path="/register" element={<RegisterPage />} />
//                     <Route path="/auth" element={<AuthPage />} /> 
//                 </Route>

//                 {/* 로그인한 사람만 접근 가능 */}
//                 <Route element={<ProtectedRoutes isAuth={isAuth} />}>
//                     {/* 아래 경로들은 모두 인증된 사용자만 접근할 수 있음 */}
//                     <Route path="/protected" element={<ProtectedPage />} />
//                     <Route
//                         path="/product/upload"
//                         element={<UploadProductPage />}
//                     />
//                     <Route
//                         path="/product/:productId"
//                         element={<DetailProductPage />}
//                     />
//                     <Route path="/user/cart" element={<CartPage />} />
//                     <Route path="/history" element={<HistoryPage />} />
//                     <Route
//                         path="/user/myproducts"
//                         element={<MyProductsPage />}
//                     />
//                     <Route path="/user/wishlist" element={<WishlistPage />} />
//                 </Route>

//                 {/* 관리자 로그인 페이지 */}
//                 <Route path="/admin/login" element={<AdminLoginPage />} />

//                 {/* 관리자 인증 보호 라우트 */}
//                 <Route element={<AdminProtectedRoutes />}>
//                     <Route
//                         path="/admin/dashboard"
//                         element={<AdminDashboardPage />}
//                     />
//                 </Route>
//             </Route>
//         </Routes>
//     );
// }
// export default App;
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "./store/thunkFunctions";
import { useEffect } from "react";
import ProtectedPage from "./pages/ProtectedPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotAuthRoutes from "./components/NotAuthRoutes";
import UploadProductPage from "./pages/UploadProductPage/index";
import CartPage from "./pages/CartPage/index";
import HistoryPage from "./pages/HistoryPage/index";
import DetailProductPage from "./pages/DetailProductPage/index";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminProtectedRoutes from "./components/AdminProtectedRoutes";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import MyProductsPage from "./pages/MyProductPage";
import { setCsrfToken } from "./utils/axios";
import WishlistPage from "./pages/WishlistPage";
import AuthPage from "./pages/AuthPage/Index"; // <- 풀스크린 적용할 페이지

function Layout() {
  const location = useLocation();

  // ✅ /auth일 때는 Layout 사용하지 않음
  if (location.pathname === "/auth") {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <ToastContainer
        position="bottom-right"
        theme="light"
        pauseOnHover
        autoClose={1500}
      />
      <Navbar />
      <main className="mb-auto w-10/12 max-w-4xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const isAuth = useSelector((state) => state.user?.isAuth);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setCsrfToken();
      dispatch(authUser());
    }
  }, []);

  return (
    <Routes>
      {/* ✅ /auth는 레이아웃 없이 풀스크린 전용 */}
      <Route path="/auth" element={<AuthPage />} />

      {/* ✅ 나머지는 레이아웃 적용 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />

        <Route element={<NotAuthRoutes isAuth={isAuth} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoutes isAuth={isAuth} />}>
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/product/upload" element={<UploadProductPage />} />
          <Route path="/product/:productId" element={<DetailProductPage />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/user/myproducts" element={<MyProductsPage />} />
          <Route path="/user/wishlist" element={<WishlistPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AdminProtectedRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
