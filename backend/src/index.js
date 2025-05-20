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

// ✅ CORS: React 개발 서버에서 쿠키를 주고받기 위한 설정
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ 보안 설정
app.use(helmet({ crossOriginResourcePolicy: false }));

// ✅ 기본 파서 설정
app.use(cookieParser());
app.use(express.json());

// ✅ 정적 파일 경로 설정
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));

// ✅ CSRF 보호 미들웨어
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // 개발 환경이므로 false (배포 시 true)
  },
});
app.use(csrfProtection);

// ✅ MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

// ✅ CSRF 토큰 요청 라우트
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ 실제 라우팅 처리
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/ads", require("./routes/adminAds"));

// ✅ 루트 라우트
app.get("/", (req, res) => {
  res.send("서버 실행 중");
});

// ✅ 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error("에러 발생:", err);
  res.status(err.status || 500).send(err.message || "서버 오류");
});

// ✅ 서버 시작
app.listen(port, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});
