const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// <<< 수정됨: 오직 ImageAd 모델만 사용합니다. 기존 VideoAd, AdVideo 등 모델은 남아 있을 필요 없습니다. >>>
const ImageAd = require("../models/ImageAd");
const { authAdmin } = require("../middleware/authAdmin");

const router = express.Router();

// Multer 설정: 업로드된 이미지는 backend/uploads/IMGads 에 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/IMGads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 예: 1629876543210-원본파일이름.jpg
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ===== 1) GET /api/admin/ad-images : 광고 이미지 목록 조회 (공개 API) =====
router.get("/", async (req, res) => {
  try {
    // ImageAd 컬렉션에서 가져오기
    const ads = await ImageAd.find()
      .populate("product")       // product 필드를 참조(populate)해서 상품 정보 가져옴
      .sort({ order: 1, createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error("광고 이미지 조회 오류:", err);
    res.status(500).json({ message: "광고 목록을 불러오지 못했습니다.", error: err });
  }
});

// ===== 2) POST /api/admin/ad-images : 새로운 광고 이미지 업로드 (관리자 인증 필요) =====
router.post("/", authAdmin, upload.single("image"), async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || !req.file) {
      return res.status(400).json({ message: "productId와 image 파일이 모두 필요합니다." });
    }

    // order 값을 기존 최대값 +1 로 설정
    const maxOrderDoc = await ImageAd.findOne().sort({ order: -1 }).select("order");
    const nextOrder = maxOrderDoc ? maxOrderDoc.order + 1 : 1;

    const newAd = new ImageAd({
      product: productId,
      image: `uploads/IMGads/${req.file.filename}`, // DB에 저장할 상대 경로
      order: nextOrder,
    });

    await newAd.save();
    res.status(201).json(newAd);
  } catch (err) {
    console.error("광고 이미지 업로드 오류:", err);
    res.status(500).json({ message: "광고 업로드에 실패했습니다.", error: err });
  }
});

// ===== 3) PATCH /api/admin/ad-images/order/:id : 광고 순서 변경 (관리자 인증 필요) =====
router.patch("/order/:id", authAdmin, async (req, res) => {
  const { id } = req.params;
  const { direction } = req.body; // "up" 또는 "down"

  if (!["up", "down"].includes(direction)) {
    return res.status(400).json({ message: "direction 값은 'up' 또는 'down'만 허용됩니다." });
  }

  try {
    const ad = await ImageAd.findById(id);
    if (!ad) return res.status(404).json({ message: "해당 광고를 찾을 수 없습니다." });

    if (direction === "up") {
      const prev = await ImageAd.findOne({ order: ad.order - 1 });
      if (prev) {
        [prev.order, ad.order] = [ad.order, prev.order];
        await prev.save();
      }
      ad.order -= 1;
    } else {
      const next = await ImageAd.findOne({ order: ad.order + 1 });
      if (next) {
        [next.order, ad.order] = [ad.order, next.order];
        await next.save();
      }
      ad.order += 1;
    }

    await ad.save();
    res.json(ad);
  } catch (err) {
    console.error("광고 순서 변경 오류:", err);
    res.status(500).json({ message: "광고 순서 변경에 실패했습니다.", error: err });
  }
});

// ===== 4) DELETE /api/admin/ad-images/:id : 광고 이미지 삭제 (관리자 인증 필요) =====
router.delete("/:id", authAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await ImageAd.findByIdAndDelete(id);
    if (!ad) return res.status(404).json({ message: "삭제할 광고를 찾을 수 없습니다." });

    // DB에서 삭제되었으면, 실제 서버 파일(이미지)도 삭제
    if (ad.image) {
      const filePath = path.join(__dirname, "../../", ad.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("광고 삭제 오류:", err);
    res.status(500).json({ message: "광고 삭제에 실패했습니다.", error: err });
  }
});

module.exports = router;
