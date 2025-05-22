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
import AuthPage from "./pages/AuthPage/index";
import EditProductPage from "./pages/EditProductPage";
import AdminAdSection from "./pages/AdminAdSection/index";
import SearchPage from "./pages/SearchPage";

function Layout() {
  const location = useLocation();

  if (location.pathname === "/auth") {
    return <Outlet />;
  }

  const isSearchPage = location.pathname.startsWith("/search");

  return (
    <div className="flex flex-col h-screen justify-between">
      <ToastContainer
        position="bottom-right"
        theme="light"
        pauseOnHover
        autoClose={1500}
      />
      <Navbar />
      <main
        className={
          isSearchPage
            ? "mb-auto w-full px-4"
            : "mb-auto w-10/12 max-w-4xl mx-auto"
        }
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const isAuth = useSelector((state) => state.user?.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setCsrfToken();
      dispatch(authUser());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/*  /auth는 풀스크린 별도 처리 */}
      <Route path="/auth" element={<AuthPage />} />

      {/*  그 외는 공통 레이아웃 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />

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
          <Route path="/product/edit/:productId" element={<EditProductPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminProtectedRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/ads" element={<AdminAdSection />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
