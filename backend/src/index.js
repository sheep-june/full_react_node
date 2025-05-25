// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const helmet = require("helmet");
// const csrf = require("csurf");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// const app = express();
// const port = 4000;

// // ✅ 보안: CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// // ✅ 보안: Helmet
// app.use(helmet({ crossOriginResourcePolicy: false }));

// // ✅ 쿠키 & JSON 파싱 (이 순서 중요)
// app.use(cookieParser());
// app.use(express.json());

// // ✅ 정적 파일 제공
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));

// // ✅ CSRF 설정
// const csrfProtection = csrf({
//   cookie: {
//     httpOnly: false, // ✅ 개발 중엔 false로
//     sameSite: "lax",
//     secure: false,
//   },
//   value: (req) => req.headers["x-csrf-token"], // ✅ 직접 헤더에서만 읽게 설정
// });


// // ✅ CSRF 토큰 요청 라우트
// app.get("/csrf-token", csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// // ✅ 나머지 요청에만 CSRF 보호 적용 (POST, PUT, DELETE만)
// app.use((req, res, next) => {
//   const csrfNeeded = ["POST", "PUT", "DELETE"].includes(req.method);
//   if (csrfNeeded) {
//     return csrfProtection(req, res, next);
//   }
//   next();
// });

// // ✅ DB 연결
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB 연결 성공"))
//   .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// // ✅ 라우터 등록은 반드시 **CSRF 보호 이후**에!
// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/reviews", require("./routes/reviews"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/admin/ads", require("./routes/adminAds"));
// app.use("/api/faq", require("./routes/faq"));
// app.use("/api/question", require("./routes/question")); // ✅ 이게 POST 요청 받는 문제 라우터

// // ✅ 루트 라우트
// app.get("/", (req, res) => {
//   res.send("서버 실행 중");
// });

// // ✅ 에러 핸들링
// app.use((err, req, res, next) => {
//   console.error("에러 발생:", err);
//   res.status(err.status || 500).send(err.message || "서버 오류");
// });

// // ✅ 서버 시작
// app.listen(port, () => {
//   console.log(`✅ 서버 실행 중: http://localhost:${port}`);
// });



const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 4000;

// ✅ 보안: CORS 설정 (프론트 주소 허용)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ 보안: Helmet
app.use(helmet({ crossOriginResourcePolicy: false }));

// ✅ 쿠키 파서 + JSON 바디 파서
app.use(cookieParser());
app.use(express.json());

// ✅ 정적 파일 서빙
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));

// ✅ DB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// ✅ 라우터 등록 (라우터 내부에 CSRF 보호 미들웨어 있음)
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/ads", require("./routes/adminAds"));
app.use("/api/faq", require("./routes/faq"));
app.use("/api/question", require("./routes/question"));

// ✅ CSRF 미들웨어 설정
const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // 개발 중엔 false
    sameSite: "lax",
    secure: false,
  },
  value: (req) => req.headers["x-csrf-token"],
});

// ✅ CSRF 토큰 발급 라우트 (항상 마지막에 위치)
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// ✅ 나머지 POST/PUT/DELETE 요청만 보호 적용
app.use((req, res, next) => {
  const csrfNeeded = ["POST", "PUT", "DELETE"].includes(req.method);
  if (csrfNeeded) {
    return csrfProtection(req, res, next);
  }
  next();
});

// ✅ 기본 루트 확인용
app.get("/", (req, res) => {
  res.send("서버 실행 중");
});

// ✅ 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("에러 발생:", err);
  res.status(err.status || 500).send(err.message || "서버 오류");
});

// ✅ 서버 실행
app.listen(port, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});
