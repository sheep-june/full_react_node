import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? "" : "http://localhost:4000",
  withCredentials: true,
  paramsSerializer: (params) => {
    if (params.filters) {
      return qs.stringify({
        ...params,
        filters: JSON.stringify(params.filters),
      });
    }
    return qs.stringify(params);
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    if (!config.headers) {
      config.headers = {};
    }

    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("adminToken");
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



export const setCsrfToken = async () => {
  try {
    const res = await axiosInstance.get("/csrf-token");
    const token = res.data.csrfToken;

    // ✅ 로컬에도 저장
    localStorage.setItem("csrfToken", token);

    // ✅ 헤더에도 등록
    axiosInstance.defaults.headers.common["X-CSRF-Token"] = token;

    // ✅ 쿠키에도 등록 ← 이게 핵심
    document.cookie = `XSRF-TOKEN=${token}; path=/;`;
  } catch (err) {
    console.error("❌ CSRF 토큰 요청 실패:", err);
  }
};



export default axiosInstance;
