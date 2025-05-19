const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decode.userId });
        if (!user) {
            return res.status(401).json({ message: "유저 없음 또는 잘못된 토큰" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("auth 미들웨어 오류:", error);
        return res.status(401).json({ message: "토큰 검증 실패" });
    }
};

module.exports = auth;
