// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const ProtectedRoutes = ({ isAuth }) => {
//     const location = useLocation();

//     console.log("🧪 ProtectedRoutes 렌더링됨");
//     console.log("🧪 현재 경로:", location.pathname);
//     console.log("🧪 isAuth 상태:", isAuth);

//     // if (!isAuth) {
//     //     if (!sessionStorage.getItem("redirectAfterLogin")) {
//     //         console.log("➡️ 세션에 경로 저장:", location.pathname);
//     //         sessionStorage.setItem("redirectAfterLogin", location.pathname);
//     //     }
//     //     return <Navigate to="/auth" state={{ from: location }} replace />;
//     // }
//     if (!isAuth) {
//         // ✅ 여기서 현재 경로를 세션에 저장해둔다
//         sessionStorage.setItem("redirectAfterLogin", location.pathname);
//         return <Navigate to="/auth" replace />;
//     }

//     return <Outlet />;
// };

// export default ProtectedRoutes;


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
