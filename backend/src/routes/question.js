const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth"); // ✅ 추가

// ✅ 모든 사용자: 질문 목록 조회 (댓글 포함)
router.get("/", async (req, res) => {
    try {
        const questions = await Question.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });

        const comments = await Comment.find().populate("admin", "name");

        const result = questions.map((q) => {
            const comment = comments.find(
                (c) => c.question.toString() === q._id.toString()
            );
            return {
                ...q.toObject(),
                comment: comment || null,
            };
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "질문 조회 실패" });
    }
});

// ✅ 일반 유저만: 질문 작성
router.post("/", auth, async (req, res) => {
    try {
        const user = req.user;

        if (!user || user.role !== 0) {
            return res
                .status(403)
                .json({ message: "일반 유저만 질문 작성 가능" });
        }

        const { title, content } = req.body;

        const question = new Question({
            title,
            content,
            user: user.id,
        });

        await question.save();
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ message: "질문 작성 실패" });
    }
});

// ✅ 관리자만: 댓글 작성
router.post("/:id/comment", adminAuth, async (req, res) => {
    try {
        const admin = req.admin;

        const { content } = req.body;
        const questionId = req.params.id;

        const comment = new Comment({
            question: questionId,
            content,
            admin: admin.id,
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        console.error("❌ 댓글 저장 실패:", err);
        res.status(500).json({ message: "댓글 작성 실패" });
    }
});

module.exports = router;
