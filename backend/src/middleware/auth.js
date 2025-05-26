const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

let auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "인증 헤더 없음" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "토큰 없음" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === 1) {
      user = await Admin.findById(decoded.id); // 관리자
    } else {
      user = await User.findById(decoded.id); // 일반 사용자
    }

    if (!user) {
      console.warn("❌ 유저가 존재하지 않음, decoded.id =", decoded.id);
      return res.status(401).json({ message: "유저 없음 또는 잘못된 토큰" });
    }

    req.user = {
      ...user.toObject(),               // ✅ 평범한 JS 객체로 변환
      id: user._id.toString(),         // ✅ id 필드 명시적으로 추가
      role: decoded.role               // ✅ 토큰에서 role 그대로 유지
    };

    next();
  } catch (error) {
    console.error("auth 미들웨어 오류:", error);
    return res.status(401).json({ message: "토큰 검증 실패" });
  }
};

module.exports = auth;
