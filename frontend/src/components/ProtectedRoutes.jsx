import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ isAuth }) => {
    const location = useLocation();

    if (!isAuth) {
        // ✅ 복귀 경로 저장
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
