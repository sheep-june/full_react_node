import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ? "" : "http://localhost:4000",
    withCredentials: true,
    paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
});

// ✅ 요청 인터셉터
axiosInstance.interceptors.request.use(
    function (config) {
        // 방어 코드: 헤더가 없으면 생성
        if (!config.headers) {
            config.headers = {};
        }

        const token = localStorage.getItem("accessToken") || localStorage.getItem("adminToken");
        const csrf = localStorage.getItem("csrfToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (csrf) {
            config.headers["X-CSRF-Token"] = csrf;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// ✅ CSRF 토큰 수동 설정 함수
export const setCsrfToken = async () => {
    try {
        const res = await axiosInstance.get("/csrf-token");
        const token = res.data.csrfToken;
        localStorage.setItem("csrfToken", token);
    } catch (err) {
        console.error("❌ CSRF 토큰 요청 실패:", err);
    }
};

export default axiosInstance;
