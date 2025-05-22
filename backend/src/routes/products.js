// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const Product = require("../models/Product");
// const multer = require("multer");
// const qs = require("qs");
// const Review = require("../models/Review");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     },
// });

// const upload = multer({ storage }).single("file");

// router.post("/image", auth, async (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             return res.status(500).send(err);
//         }
//         return res.json({ fileName: res.req.file.filename });
//     });
// });

// // ✅ 상품 상세 조회
// router.get("/:id", async (req, res, next) => {
//     try {
//         const product = await Product.findById(req.params.id).populate("writer");
//         const reviews = await Review.find({ product: req.params.id }).populate("user", "name");

//         const averageRating =
//             reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

//         res.status(200).json({
//             product,
//             reviews,
//             averageRating: reviews.length ? averageRating : 0,
//         });
//     } catch (error) {
//         next(error);
//     }
// });
// router.get("/", async (req, res) => {
//     try {
//         const { skip = 0, limit = 20, filters = {}, searchTerm = "", sort } = req.query;
//         const query = {};

//         if (searchTerm) {
//             query.title = { $regex: searchTerm, $options: "i" };
//         }

//         if (filters.categories && filters.categories.length > 0) {
//             query.continents = { $in: filters.categories };
//         }

//         if (filters.price && filters.price.length === 2) {
//             query.price = {
//                 $gte: filters.price[0],
//                 $lte: filters.price[1],
//             };
//         }

//         // 👉 기본 상품 목록 먼저 가져옴
//         const rawProducts = await Product.find(query)
//             .skip(parseInt(skip))
//             .limit(parseInt(limit));

//         // 👉 각 상품별로 리뷰 평균을 계산하여 averageRating 추가
//         const products = await Promise.all(
//             rawProducts.map(async (product) => {
//                 const reviews = await Review.find({ product: product._id });
//                 const avg =
//                     reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

//                 return {
//                     ...product._doc,
//                     averageRating: reviews.length ? avg.toFixed(1) : "0.0",
//                 };
//             })
//         );

//         // 👉 정렬
//         let sorted = [...products];
//         switch (sort) {
//             case "views":
//                 sorted.sort((a, b) => b.views - a.views);
//                 break;
//             case "rating":
//                 sorted.sort((a, b) => b.averageRating - a.averageRating);
//                 break;
//             case "lowPrice":
//                 sorted.sort((a, b) => a.price - b.price);
//                 break;
//             case "highPrice":
//                 sorted.sort((a, b) => b.price - a.price);
//                 break;
//             case "sold":
//                 sorted.sort((a, b) => b.sold - a.sold);
//                 break;
//             default:
//                 sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         }

//         const totalCount = await Product.countDocuments(query);
//         const hasMore = parseInt(skip) + parseInt(limit) < totalCount;

//         res.status(200).json({
//             products: sorted,
//             hasMore,
//         });
//     } catch (err) {
//         console.error("❌ 상품 목록 조회 실패:", err);
//         res.status(400).send("상품 목록 조회 실패");
//     }
// });


// // ✅ 상품 등록
// router.post("/", auth, async (req, res, next) => {
//     try {
//         const product = new Product(req.body);
//         await product.save();
//         return res.sendStatus(201);
//     } catch (error) {
//         next(error);
//     }
// });

// // ✅ 상품 삭제
// router.delete("/:id", auth, async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).send("상품을 찾을 수 없습니다.");
//         if (product.writer.toString() !== req.user._id.toString()) {
//             return res.status(403).send("삭제 권한이 없습니다.");
//         }

//         await Product.findByIdAndDelete(req.params.id);
//         res.send("상품이 삭제되었습니다.");
//     } catch (err) {
//         console.error("상품 삭제 오류:", err);
//         res.status(500).send("서버 오류로 삭제에 실패했습니다.");
//     }
// });

// // ✅ 상품 수정
// router.put("/:id", auth, async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).send("상품을 찾을 수 없습니다.");
//         if (product.writer.toString() !== req.user._id.toString()) {
//             return res.status(403).send("수정 권한이 없습니다.");
//         }

//         await Product.findByIdAndUpdate(req.params.id, req.body);
//         res.send("상품이 수정되었습니다.");
//     } catch (err) {
//         res.status(500).send("상품 수정 실패");
//     }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const multer = require("multer");
const Review = require("../models/Review");

// 이미지 업로드 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage }).single("file");

// 이미지 업로드 API
router.post("/image", auth, (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(500).send(err);
        return res.json({ fileName: res.req.file.filename });
    });
});

// 상품 상세 조회
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("writer");
        const reviews = await Review.find({ product: req.params.id }).populate("user", "name");

        const averageRating = reviews.length
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        res.status(200).json({
            product,
            reviews,
            averageRating,
        });
    } catch (error) {
        next(error);
    }
});

// 상품 목록 조회 + 정렬 + 필터 + 검색
router.get("/", async (req, res) => {
    try {
        const { skip = 0, limit = 20, filters = {}, searchTerm = "", sort } = req.query;
        const query = {};

        // 검색
        if (searchTerm) {
            query.title = { $regex: searchTerm, $options: "i" };
        }

        // 카테고리 필터 (DB는 continents 필드 사용)
        if (filters.continents && filters.continents.length > 0) {
            query.continents = { $in: filters.continents };
        }

        // 가격 필터
        if (filters.price && filters.price.length === 2) {
            query.price = {
                $gte: filters.price[0],
                $lte: filters.price[1],
            };
        }

        const rawProducts = await Product.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const productsWithRating = await Promise.all(
            rawProducts.map(async (product) => {
                const reviews = await Review.find({ product: product._id });
                const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
                return {
                    ...product._doc,
                    averageRating: reviews.length ? parseFloat(avg.toFixed(1)) : 0,
                };
            })
        );

        // 정렬
        let sorted = [...productsWithRating];
        switch (sort) {
            case "views":
                sorted.sort((a, b) => b.views - a.views);
                break;
            case "rating":
                sorted.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case "lowPrice":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "highPrice":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "sold":
                sorted.sort((a, b) => b.sold - a.sold);
                break;
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        const totalCount = await Product.countDocuments(query);
        const hasMore = parseInt(skip) + parseInt(limit) < totalCount;

        res.status(200).json({
            products: sorted,
            hasMore,
        });
    } catch (err) {
        console.error("❌ 상품 목록 조회 실패:", err);
        res.status(400).send("상품 목록 조회 실패");
    }
});

// 상품 등록
router.post("/", auth, async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

// 상품 삭제
router.delete("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("상품을 찾을 수 없습니다.");
        if (product.writer.toString() !== req.user._id.toString()) {
            return res.status(403).send("삭제 권한이 없습니다.");
        }

        await Product.findByIdAndDelete(req.params.id);
        res.send("상품이 삭제되었습니다.");
    } catch (err) {
        console.error("상품 삭제 오류:", err);
        res.status(500).send("서버 오류로 삭제에 실패했습니다.");
    }
});

// 상품 수정
router.put("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send("상품을 찾을 수 없습니다.");
        if (product.writer.toString() !== req.user._id.toString()) {
            return res.status(403).send("수정 권한이 없습니다.");
        }

        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.send("상품이 수정되었습니다.");
    } catch (err) {
        res.status(500).send("상품 수정 실패");
    }
});

module.exports = router;
