const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 질문 작성자는 일반 사용자만 가능
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 포함
  }
);

module.exports = mongoose.model("Question", questionSchema);
