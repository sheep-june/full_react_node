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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/ads", express.static(path.join(__dirname, "../uploads/ads")));

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
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/reviews", require("./routes/reviews"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/ads", require("./routes/adminAds"));

app.get("/", (req, res) => {
  res.send("서버 실행 중");
});

app.use((err, req, res, next) => {
  console.error("에러 발생:", err);
  res.status(err.status || 500).send(err.message || "서버 오류");
});

app.listen(port, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${port}`);
});
