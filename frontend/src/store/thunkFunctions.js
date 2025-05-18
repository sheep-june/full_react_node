import { createAsyncThunk } from "@reduxjs/toolkit";
// Redux Toolkit에서 비동기 액션 생성을 위한 createAsyncThunk를 가져옵니다.

import axiosInstance from "../utils/axios";
// axios의 공통 설정 인스턴스를 가져옵니다 (baseURL, interceptors 등 적용됨)

// 회원가입 요청을 위한 비동기 thunk 액션 생성
export const registerUser = createAsyncThunk(
    "user/registerUser",
    // 이 thunk 액션의 이름 (type prefix)
    // 'user' 슬라이스에서 처리될 비동기 액션 이름으로 사용됨

    async (body, thunkAPI) => {
        // 비동기 요청 처리 함수
        // body: 회원가입 폼에서 전달된 사용자 입력값 객체
        // thunkAPI: dispatch, getState 등 redux-thunk에서 제공하는 유틸 객체

        try {
            const response = await axiosInstance.post(
                "/users/register",
                // 서버의 회원가입 API 경로에 POST 요청을 보냄
                body
                // 요청 본문에 사용자 입력 데이터 포함
            );

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/loginUser",

    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/users/login", body);

            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const authUser = createAsyncThunk(
    "user/authUser",

    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/users/auth");

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/users/logout");

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    "user/addToCart",

    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/users/cart", body);

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const getCartItems = createAsyncThunk(
    "user/getCartItems",

    async ({ cartItemIds, userCart }, thunkAPI) => {
        try {
            const response = await axiosInstance.get(
                `/products/${cartItemIds}?type=array`
            );

            userCart.forEach((cartItem) => {
                response.data.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data[index].quantity = cartItem.quantity;
                    }
                });
            });

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const removeCartItem = createAsyncThunk(
    "user/removeCartItem",

    async (productId, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(
                `/users/cart?productId=${productId}`
            );

            response.data.cart.forEach((cartItem) => {
                response.data.productInfo.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data.productInfo[index].quantity =
                            cartItem.quantity;
                    }
                });
            });

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const payProducts = createAsyncThunk(
    "user/payProducts",
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/users/payment", body);

            return response.data;
        } catch (error) {
            console.log(error);

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
