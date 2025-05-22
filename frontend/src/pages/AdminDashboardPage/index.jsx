import React, { useState } from "react";
import UserSection from "./Sections/UserSection";
import PostSection from "./Sections/PostSection";
import { Link } from "react-router-dom"; // ✅ 추가

const AdminDashboardPage = () => {
    const [section, setSection] = useState("users");

    return (
        <section className="p-4">
            <h2 className="text-xl font-bold mb-4">관리자 대시보드</h2>

            {/* ✅ 섹션 전환 버튼 */}
            <div className="mb-6 space-x-2">
                <button
                    className={`px-4 py-2 rounded ${section === "users"
                            ? "bg-black text-white"
                            : "bg-gray-200"
                        }`}
                    onClick={() => setSection("users")}
                >
                    전체 사용자 보기
                </button>

                <button
                    className={`px-4 py-2 rounded ${section === "posts"
                            ? "bg-black text-white"
                            : "bg-gray-200"
                        }`}
                    onClick={() => setSection("posts")}
                >
                    전체 게시글 보기
                </button>

                {/* ✅ 광고 설정 페이지 이동 버튼 */}
                <Link
                    to="/admin/ads"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    광고 설정
                </Link>
            </div>

            {/* ✅ 현재 섹션 표시 */}
            {section === "users" && <UserSection />}
            {section === "posts" && <PostSection />}
        </section>
    );
};

export default AdminDashboardPage;
