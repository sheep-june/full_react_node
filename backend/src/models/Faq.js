const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // 작성자는 관리자만 가능
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 추가
  }
);

module.exports = mongoose.model("Faq", faqSchema);
