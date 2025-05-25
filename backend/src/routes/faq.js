const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");
const auth = require("../middleware/auth");
const Admin = require("../models/Admin");

// 모든 사용자: FAQ 목록 조회
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find().populate("admin", "name");
    res.status(200).json(faqs);
  } catch (err) {
    res.status(500).json({ message: "FAQ 조회 실패" });
  }
});

// 관리자만: FAQ 작성
router.post("/", auth, async (req, res) => {
  try {
    // 관리자 여부 확인
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "관리자만 작성할 수 있습니다." });
    }

    const { title, content } = req.body;
    const faq = new Faq({
      title,
      content,
      admin: user.id,
    });

    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: "FAQ 작성 실패" });
  }
});

module.exports = router;
