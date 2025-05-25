import { useEffect, useState } from "react";
import axios from "axios";
import CommentBox from "../../../components/Board/CommentBox";
import { toast } from "react-toastify";

const BoardSection = () => {
  const [questions, setQuestions] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/api/question");
      setQuestions(res.data);
    } catch (err) {
      toast.error("질문 목록을 불러오지 못했습니다.");
    }
  };

  const handleOpenComment = (id) => {
    setActiveCommentId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">질문게시판 관리</h2>

      {questions.length === 0 ? (
        <p className="text-gray-500">질문이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="border rounded p-4 bg-white shadow-sm relative"
            >
              <h3 className="font-semibold text-lg">{q.title}</h3>
              <p className="text-gray-700 mt-2 whitespace-pre-line">
                {q.content}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                작성자: {q.user?.name || "유저"} /{" "}
                {new Date(q.createdAt).toLocaleString()}
              </p>

              {q.comment ? (
                <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium">💬 답변</p>
                  <p className="mt-1">{q.comment.content}</p>
                  <p className="text-xs text-gray-400 text-right mt-2">
                    {q.comment.admin?.name} /{" "}
                    {new Date(q.comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenComment(q._id)}
                    className="mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    {activeCommentId === q._id ? "닫기" : "답변 작성"}
                  </button>

                  {activeCommentId === q._id && (
                    <div className="mt-2">
                      <CommentBox
                        questionId={q._id}
                        onFinish={() => {
                          setActiveCommentId(null);
                          fetchQuestions();
                        }}
                        onClose={() => setActiveCommentId(null)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardSection;
