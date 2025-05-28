import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuestionItem from "../../components/Board/QuestionItem";
import { toast } from "react-toastify";
import axiosInstance, { setCsrfToken } from "../../utils/axios";

const QuestionPage = () => {
  const user = useSelector((state) => state.user?.userData);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });
  const fetchQuestions = async () => {
    try {
      const res = await axiosInstance.get("/api/question");
      setQuestions(res.data);
    } catch (err) {
      toast.error("질문 목록을 불러올 수 없습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setCsrfToken(); 
    await new Promise((r) => setTimeout(r, 100)); 
    if (!newQuestion.title || !newQuestion.content) {
      return toast.warn("제목과 내용을 모두 입력해주세요.");
    }
    try {
      const res = await axiosInstance.post("/api/question", newQuestion);
      toast.success("질문이 등록되었습니다.");
      setNewQuestion({ title: "", content: "" });
      setShowForm(false);
      setQuestions((prev) => [res.data, ...prev]);
    } catch (err) {
      toast.error("질문 등록에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">❓ 질문게시판</h2>

      {/* ✅ 일반 유저(0)만 작성 가능 */}
      {user?.role === 0 && (
        <>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showForm ? "작성 닫기" : "질문 작성"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-2 mb-6">
              <input
                type="text"
                placeholder="제목"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="내용"
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, content: e.target.value })
                }
                className="w-full border px-3 py-2 rounded h-32"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                등록하기
              </button>
            </form>
          )}
        </>
      )}
      {questions.length === 0 ? (
        <p className="text-gray-500">등록된 질문이 없습니다.</p>
      ) : (
        questions.map((q) => <QuestionItem key={q._id} question={q} />)
      )}
    </div>
  );
};

export default QuestionPage;
