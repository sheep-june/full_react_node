import React, { useState } from "react";
import UserSection from "./Sections/UserSection";
import PostSection from "./Sections/PostSection";
import { Link, useNavigate } from "react-router-dom"; // ✅ navigate 추가

const AdminDashboardPage = () => {
    const [section, setSection] = useState("users");
    const navigate = useNavigate();

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    return (
        <section className="p-4">
    {/* ✅ 제목 + 로그아웃 버튼 우측 정렬 */}
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl border-[#00C4C4] text-[#00C4C4]">관리자 대시보드</h2>
        <button
            onClick={handleAdminLogout}
            className="text-sm px-3 py-1 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200"
        >
            로그아웃
        </button>
    </div>

    {/* ✅ 섹션 전환 및 이동 버튼들 */}
    <div className="mb-6 space-x-2">
        <button
            className={`px-4 py-2 rounded transition-colors duration-200 ${
                section === "users"
                    ? "bg-[#00C4C4] text-white"
                    : "bg-white text-[#00C4C4] border border-[#00C4C4] hover:bg-[#00C4C4] hover:text-white"
            }`}
            onClick={() => setSection("users")}
        >
            전체 사용자 보기
        </button>

        <button
            className={`px-4 py-2 rounded transition-colors duration-200 ${
                section === "posts"
                    ? "bg-[#00C4C4] text-white"
                    : "bg-white text-[#00C4C4] border border-[#00C4C4] hover:bg-[#00C4C4] hover:text-white"
            }`}
            onClick={() => setSection("posts")}
        >
            전체 게시글 보기
        </button>

        <Link
            to="/admin/ads"
            className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200 inline-block"
        >
            광고 설정
        </Link>

        <Link
            to="/admin/board"
            className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200 inline-block"
        >
            질문게시판 관리
        </Link>

        <Link
            to="/admin/faq-write"
            className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200 inline-block"
        >
            FAQ 작성
        </Link>

        <Link
            to="/board/faq"
            className="px-4 py-2 border border-[#00C4C4] text-[#00C4C4] bg-white rounded hover:bg-[#00C4C4] hover:text-white transition-colors duration-200 inline-block"
        >
            📄 FAQ 게시판
        </Link>
    </div>

    {/* ✅ 현재 선택된 섹션 표시 */}
    {section === "users" && <UserSection />}
    {section === "posts" && <PostSection />}
</section>

    );
};

export default AdminDashboardPage;
