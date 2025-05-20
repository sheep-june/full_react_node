const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/adminAuth");


// 📁 backend/src/routes/admin.js

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json("이메일이 존재하지 않습니다.");

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json("비밀번호가 틀립니다.");

    const payload = {
        id: admin._id,
        role: admin.role, 
        name: admin.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ token, admin });
});


router.get("/users", adminAuth, async (req, res) => {
    try {
        const users = await User.find({}, "_id name email");
        res.json(users);
    } catch (err) {
        res.status(500).json("유저 목록을 불러오는 데 실패했습니다.");
    }
});

router.get("/posts", adminAuth, async (req, res) => {
    try {
        const posts = await Product.find({}, "_id title description");
        res.json(posts);
    } catch (err) {
        res.status(500).json("게시글 목록을 불러오는 데 실패했습니다.");
    }
});

router.delete("/users/:id", adminAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json("유저 삭제에 실패했습니다.");
    }
});

router.delete("/posts/:id", adminAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json("게시글 삭제에 실패했습니다.");
    }
});

module.exports = router;
