const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const Product = require("../models/Product");

const multer = require("multer");

const qs = require("qs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", auth, async (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return req.status(500).send(err);
        }

        return res.json({ fileName: res.req.file.filename });
    });
});

router.get("/:id", async (req, res, next) => {
    const type = req.query.type;

    let productIds = req.params.id;

    if (type === "array") {
        let ids = productIds.split(",");

        productIds = ids.map((item) => {
            return item;
        });
    }

    try {
        const product = await Product.find({
            _id: { $in: productIds },
        }).populate("writer");

        return res.status(200).send(product);
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    const parsed = qs.parse(req._parsedUrl.query);
    const order = parsed.order || "desc";
    const sortBy = parsed.sortBy || "_id";
    const limit = parsed.limit ? Number(parsed.limit) : 20;
    const skip = parsed.skip ? Number(parsed.skip) : 0;
    const term = parsed.searchTerm;

    let findArgs = {};
    for (let key in parsed.filters) {
        if (parsed.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: parsed.filters[key][0],
                    $lte: parsed.filters[key][1],
                };
            } else {
                findArgs[key] = parsed.filters[key];
            }
        }
    }

    if (term) {
        findArgs["title"] = { $regex: term, $options: "i" };
    }

    try {
        const products = await Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit);

        const productsTotal = await Product.countDocuments(findArgs);
        const hasMore = skip + limit < productsTotal ? true : false;

        return res.status(200).json({
            products,
            hasMore,
        });
    } catch (error) {
        next(error);
    }
});
router.post("/", auth, async (req, res, next) => {
    try {
        const product = new Product(req.body);
        product.save();
        return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("상품을 찾을 수 없습니다.");
        }

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

module.exports = router;
