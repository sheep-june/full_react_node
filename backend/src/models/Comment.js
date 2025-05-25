const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", // 어떤 질문에 대한 댓글인지
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Admin", // 댓글 작성자는 관리자만
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 포함
  }
);

module.exports = mongoose.model("Comment", commentSchema);

