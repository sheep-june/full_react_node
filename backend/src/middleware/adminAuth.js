const jwt = require("jsonwebtoken");

// 관리자 인증 미들웨어
module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN" 형태에서 TOKEN만 추출

    if (!token) {
        return res.status(401).json("관리자 토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // 토큰 검증
        req.admin = decoded; // 이후 req.admin으로 접근 가능
        next(); // 다음 미들웨어 또는 라우터 실행
    } catch (err) {
        return res.status(403).json("유효하지 않은 관리자 토큰입니다.");
    }
};
