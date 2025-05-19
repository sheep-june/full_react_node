import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../store/thunkFunctions";
import { setCsrfToken } from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isAnimatingExit, setIsAnimatingExit] = useState(false);

  useEffect(() => {
    setCsrfToken();
  }, []);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({ mode: "onChange" });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm({ mode: "onChange" });

  const onLogin = async ({ email, password }) => {
    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        resetLogin();
        setIsAnimatingExit(true); // ✅ 애니메이션 시작
        setTimeout(() => {
          navigate("/"); // ✅ 이동
        }, 800); // 애니메이션 시간과 일치
      } else {
        alert("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  const onRegister = async ({ name, email, password }) => {
    try {
      const result = await dispatch(
        registerUser({
          name,
          email,
          password,
          image: "https://via.placeholder.com/600x400?text=no+user+image",
        })
      );

      if (registerUser.fulfilled.match(result)) {
        resetRegister();
        setIsRightPanelActive(false);
      } else {
        alert("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
    }
  };

  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-[#f6f5f7] font-[Montserrat] relative flex">
      {/* 회원가입 폼 */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
          isRightPanelActive ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
        }`}
      >
        <form
          onSubmit={handleRegisterSubmit(onRegister)}
          className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
        >
          <h1 className="text-2xl font-bold mb-2">회원가입</h1>
          <input
            type="text"
            placeholder="Name"
            {...registerRegister("name", { required: "이름은 필수입니다." })}
            className="bg-gray-200 px-4 py-2 mb-2 w-full max-w-[300px]"
          />
          <input
            type="email"
            placeholder="Email"
            {...registerRegister("email", { required: "이메일은 필수입니다." })}
            className="bg-gray-200 px-4 py-2 mb-2 w-full max-w-[300px]"
          />
          <input
            type="password"
            placeholder="Password"
            {...registerRegister("password", {
              required: "비밀번호는 필수입니다.",
              minLength: { value: 6, message: "최소 6자입니다." },
            })}
            className="bg-gray-200 px-4 py-2 mb-2 w-full max-w-[300px]"
          />
          <button type="submit" className="mt-2 px-6 py-2 bg-[#00C4C4] text-white rounded-full">
            회원가입
          </button>
          <button
            type="button"
            onClick={() => setIsRightPanelActive(false)}
            className="mt-4 text-sm text-[#00C4C4]"
          >
            로그인으로
          </button>
        </form>
      </div>

      {/* 로그인 폼 */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
          isRightPanelActive ? "translate-x-full opacity-0 z-10" : "opacity-100 z-20"
        }`}
      >
        <form
          onSubmit={handleLoginSubmit(onLogin)}
          className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
        >
          <h1 className="text-2xl font-bold mb-2">로그인</h1>
          <input
            type="email"
            placeholder="Email"
            {...loginRegister("email", { required: "이메일은 필수입니다." })}
            className="bg-gray-200 px-4 py-2 mb-2 w-full max-w-[300px]"
          />
          <input
            type="password"
            placeholder="Password"
            {...loginRegister("password", {
              required: "비밀번호는 필수입니다.",
              minLength: { value: 6, message: "최소 6자입니다." },
            })}
            className="bg-gray-200 px-4 py-2 mb-2 w-full max-w-[300px]"
          />
          <button type="submit" className="px-6 py-2 bg-[#00C4C4] text-white rounded-full">
            로그인
          </button>
          <button
            type="button"
            onClick={() => setIsRightPanelActive(true)}
            className="mt-4 text-sm text-[#00C4C4]"
          >
            회원가입으로
          </button>
        </form>
      </div>

      {/* 오버레이 패널 */}
      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-700 z-30 ${
          isRightPanelActive ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="w-full h-full bg-gradient-to-r from-[#00C4C4] to-[#00a8a8] text-white flex flex-col items-center justify-center px-10 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {isRightPanelActive ? "Welcome Back!" : "Hello, Friend!"}
          </h1>
          <p className="text-sm mb-4">개인 정보를 입력하고 여정을 시작하세요</p>
        </div>
      </div>

      {/* ✅ 로그인 성공 시 흰 배경 화면이 좌우로 갈라지는 효과 */}
      {isAnimatingExit && (
        <div className="absolute top-0 left-0 w-full h-full z-50 flex">
          <div className="w-1/2 h-full bg-white animate-split-left" />
          <div className="w-1/2 h-full bg-white animate-split-right" />
        </div>
      )}
    </div>
  );
};

export default AuthPage;
