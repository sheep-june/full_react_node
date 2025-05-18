// const express = require("express");
// const path = require("path");
// const app = express();

// const cors = require("cors");
// const helmet = require("helmet");
// const csrf = require("csurf");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

// const port = 4000;

// app.use(
//     "/uploads",
//     cors({
//         origin: "http://localhost:5173",
//         credentials: true,
//     }),
//     express.static(path.join(__dirname, "../uploads"))
// );

// app.use(
//     helmet({
//         crossOriginResourcePolicy: false,
//     })
// );

// app.use(
//     cors({
//         origin: "http://localhost:5173",
//         credentials: true,
//     })
// );
// app.use(cookieParser());
// app.use(express.json());

// const csrfProtection = csrf({
//     cookie: {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: false,
//     },
// });
// app.use(csrfProtection);

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log("MongoDB 연결 성공"))
//     .catch((err) => console.error(err));

// app.get("/csrf-token", (req, res) => {
//     res.json({ csrfToken: req.csrfToken() });
// });

// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/api/admin", require("./routes/admin"));

// app.get("/", (req, res) => {
//     res.send("서버 실행 중");
// });

// app.use((err, req, res, next) => {
//     res.status(err.status || 500).send(err.message || "서버 에러");
// });

// app.listen(port, () => {
//     console.log(`${port}번에서 실행 중`);
// });


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

// ✅ CORS는 무조건 맨 위에서 한 번만
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// ✅ 쿠키 및 본문 파서
app.use(cookieParser());
app.use(express.json());

// ✅ helmet (cors 다음에)
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

// ✅ static 파일 업로드 경로
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ CSRF 설정
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // http 환경
    },
});
app.use(csrfProtection);

// ✅ MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.error(err));

// ✅ CSRF 토큰 전달 라우트
app.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ✅ 실제 라우트
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
    res.send("서버 실행 중");
});

// ✅ 에러 처리
app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message || "서버 에러");
});

app.listen(port, () => {
    console.log(`${port}번에서 실행 중`);
});
