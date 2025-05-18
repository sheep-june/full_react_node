// ✅ utils/axios.js (전체 교체)
import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ? "" : "http://localhost:4000",
    withCredentials: true,
    paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
});

axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("accessToken");
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
    const res = await axiosInstance.get("/csrf-token", {
        withCredentials: true,
    });

    const token = res.data.csrfToken;
    localStorage.setItem("csrfToken", token);
};

export default axiosInstance;
