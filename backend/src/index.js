// const express = require("express");
// const path = require("path");
// const app = express();

// const cors = require("cors");
// const helmet = require("helmet");
// const cookieParser = require("cookie-parser");
// const port = 4000;

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// app.use(helmet()); // XSS, 클릭재킹 등 기본 보안 헤더 설정

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());

// app.use(cors());
// app.use(express.json());

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log("연결완료");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// app.get("/", (req, res, next) => {
//     setImmediate(() => {next(new Error("it is an error")) });
//     //res.send("안녕하세요11");
// });

// app.post("/", (req, res) => {
//     console.log(req.body);
//     res.json(req.body);
// });

// // app.use("/admin", require("./routes/admin"));
// app.use('/users',require('./routes/users'));
// app.use('/products', require('./routes/products'));
// app.use("/api/admin", require("./routes/admin"));

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.send(error.message || "서버 에러 ");
// });

// app.use(express.static(path.join(__dirname, "../uploads")));

// app.listen(port, () => {
//     console.log(`${port}번에서 실행이 되었습니다.`);
// });

//절취선---------------------------------------------------------
// const express = require("express");
// const path = require("path");
// const app = express();

// const cors = require("cors");
// const helmet = require("helmet");
// const csrf = require("csurf");
// const cookieParser = require("cookie-parser");
// const port = 4000;

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use(helmet()); // 보안 헤더 설정
// app.use(
//   cors({
//     origin: "http://localhost:5173", // 프론트 주소 정확히 명시
//     credentials: true, // 쿠키 기반 요청 허용 (앞으로 CSRF 대비용)
//   })
// );

// // 쿠키 기반 CSRF 보호 미들웨어
// const csrfProtection = csrf({
//   cookie: {
//     httpOnly: true,
//     sameSite: "lax", // CSRF 방어 목적에 맞게 설정
//     secure: false,   // HTTPS 적용 후 true로 변경
//   },
// });

// app.use(cookieParser());        // 1. 쿠키 파싱
// app.use(express.json());        // 2. JSON 파싱
// app.use(csrfProtection);        // 3. CSRF 검사

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("연결완료");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // 테스트용 루트 라우트
// app.get("/", (req, res, next) => {
//   setImmediate(() => {
//     next(new Error("it is an error"));
//   });
// });

// // CSRF 토큰을 클라이언트에 제공
// app.get("/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// // 테스트 POST
// app.post("/", (req, res) => {
//   console.log(req.body);
//   res.json(req.body);
// });

// // 실제 라우터 등록
// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/api/admin", require("./routes/admin"));

// // 에러 처리기
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.send(error.message || "서버 에러");
// });

// // // 정적 파일 제공
// // app.use(express.static(path.join(__dirname, "../uploads")));

// // 서버 실행
// app.listen(port, () => {
//   console.log(`${port}번에서 실행이 되었습니다.`);
// });

//절취선---------------------------------------------------------
const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");
const helmet = require("helmet");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const port = 4000;

// ✅ 1. 정적 이미지 먼저 등록
app.use(
    "/uploads",
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
    express.static(path.join(__dirname, "../uploads"))
);

// ✅ 2. helmet 설정 (CORP 끄기)
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

// ✅ 3. 일반 보안 및 JSON 파싱
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    },
});
app.use(csrfProtection);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.error(err));

app.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/api/admin", require("./routes/admin"));

// ✅ 8. 테스트용
app.get("/", (req, res) => {
    res.send("서버 실행 중");
});

// ✅ 9. 에러 핸들러
app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message || "서버 에러");
});

// ✅ 10. 서버 실행
app.listen(port, () => {
    console.log(`${port}번에서 실행 중`);
});
