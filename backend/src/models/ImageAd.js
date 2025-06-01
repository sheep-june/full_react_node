
const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageAdSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",    // 상품 컬렉션 참조
      required: true,
    },
    image: {
      type: String,      // 예: "uploads/IMGads/1629876543210-original.jpg"
      required: true,
    },
    order: {
      type: Number,      // 정렬 순서
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImageAd", imageAdSchema);
