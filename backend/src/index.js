

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

app.use(cookieParser());
app.use(express.json());

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // http 환경
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
