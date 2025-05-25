import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance, { setCsrfToken } from "../../utils/axios";

const CommentBox = ({ questionId, onFinish, onClose }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return toast.warn("댓글 내용을 입력해주세요.");
    }

    try {
      // ✅ CSRF 토큰 요청 및 헤더 동기화
      await setCsrfToken();
      await new Promise((r) => setTimeout(r, 100));

      // ✅ 안전한 axios 인스턴스 사용
      await axiosInstance.post(`/api/question/${questionId}/comment`, { content });

      toast.success("댓글이 등록되었습니다.");
      setContent("");
      if (onFinish) onFinish(); // 목록 새로고침
      if (onClose) onClose();   // 폼 닫기
    } catch (err) {
      toast.error("댓글 등록 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답변 내용을 입력하세요"
        className="w-full border px-3 py-2 rounded h-24"
      />
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          등록
        </button>
      </div>
    </form>
  );
};

export default CommentBox;
