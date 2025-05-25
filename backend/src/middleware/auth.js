// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Admin = require("../models/Admin"); // ⬅️ 추가 필요

// let auth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers["authorization"];
//         if (!authHeader) {
//             return res.status(401).json({ message: "인증 헤더 없음" });
//         }

//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ message: "토큰 없음" });
//         }

//         const decode = jwt.verify(token, process.env.JWT_SECRET);

//         // ✅ 사용자 토큰일 경우
//         let user = await User.findById(decode.id);
//         if (user) {
//             req.user = user;
//             return next();
//         }

//         // ✅ 관리자 토큰일 경우
//         let admin = await Admin.findById(decode.id);
//         if (admin) {
//             req.user = admin;
//             return next();
//         }

//         // ✅ 둘 다 아니면 실패
//         return res.status(401).json({ message: "유저 없음 또는 잘못된 토큰" });
//     } catch (error) {
//         console.error("auth 미들웨어 오류:", error);
//         return res.status(401).json({ message: "토큰 검증 실패" });
//     }
// };

// module.exports = auth;

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
      return res.status(401).json({ message: "유저 없음 또는 잘못된 토큰" });
    }

    req.user = { ...user.toObject(), role: decoded.role }; // ✅ 여기서 명확하게 role 지정
    next();
  } catch (error) {
    console.error("auth 미들웨어 오류:", error);
    return res.status(401).json({ message: "토큰 검증 실패" });
  }
};

module.exports = auth;
