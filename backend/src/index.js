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
app.use("/IMGads", express.static(path.join(__dirname, "../uploads/IMGads"))); 

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공"))
  .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/reviews", require("./routes/reviews"));

app.use("/api/admin", require("./routes/admin"));
// app.use("/api/admin/ads", require("./routes/adminAds"));
app.use("/api/admin/ad-images", require("./routes/adminImageAds"));

app.use("/api/faq", require("./routes/faq"));
app.use("/api/question", require("./routes/question"));

const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // 개발 중엔 false
    sameSite: "lax",
    secure: false,
  },
  value: (req) => req.headers["x-csrf-token"],
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
  const csrfNeeded = ["POST", "PUT", "DELETE"].includes(req.method);
  if (csrfNeeded) {
    return csrfProtection(req, res, next);
  }
  next();
});

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
