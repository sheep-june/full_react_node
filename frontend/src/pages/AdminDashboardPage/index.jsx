// // pages/AdminDashboardPage/index.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminDashboardPage = () => {
//     const [users, setUsers] = useState([]);     // 반드시 배열로 초기화
//     const [posts, setPosts] = useState([]);     // 반드시 배열로 초기화
//     const token = localStorage.getItem("adminToken");

//     const fetchUsers = async () => {
//         try {
//             const res = await axios.get("/api/admin/users", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             console.log("유저 응답 데이터", res.data);
//             setUsers(res.data);  // ⚠️ 응답이 배열인지 확인 필요
//         } catch (err) {
//             console.error("유저 로딩 실패", err);
//             setUsers([]); // 실패 시 비워줌
//         }
//     };

//     const fetchPosts = async () => {
//         try {
//             const res = await axios.get("/api/admin/posts", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             console.log(" 게시글 응답:", res.data);
//             setPosts(res.data);  // ⚠️ 응답이 배열인지 확인 필요
//         } catch (err) {
//             console.error("게시글 로딩 실패", err.response?.data || err.message);
//             setPosts([]); // 실패 시 비워줌
//         }
//     };

//     const handleDeleteUser = async (id) => {
//         if (!window.confirm("정말로 이 유저를 삭제하시겠습니까?")) return;
//         try {
//             await axios.delete(`/api/admin/users/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             fetchUsers();
//         } catch (err) {
//             console.error("유저 삭제 실패", err);
//         }
//     };

//     const handleDeletePost = async (id) => {
//         if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
//         try {
//             await axios.delete(`/api/admin/posts/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             fetchPosts();
//         } catch (err) {
//             console.error("게시글 삭제 실패", err);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//         fetchPosts();
//     }, []);

//     return (
//         <section className="p-4">
//             <h2 className="text-xl font-bold mb-4">관리자 대시보드</h2>

//             <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">전체 사용자</h3>
//                 {Array.isArray(users) ? (
//                     <ul className="space-y-2">
//                         {users.map((user) => (
//                             <li key={user._id} className="flex justify-between border p-2">
//                                 <div>
//                                     <p>이름: {user.name}</p>
//                                     <p>이메일: {user.email}</p>
//                                 </div>
//                                 <button
//                                     className="bg-red-500 text-white px-2 py-1 rounded"
//                                     onClick={() => handleDeleteUser(user._id)}
//                                 >
//                                     삭제
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>유저 목록을 불러올 수 없습니다.</p>
//                 )}
//             </div>

//             <div>
//                 <h3 className="text-lg font-semibold mb-2">전체 게시글</h3>
//                 {Array.isArray(posts) ? (
//                     <ul className="space-y-2">
//                         {posts.map((post) => (
//                             <li key={post._id} className="flex justify-between border p-2">
//                                 <div>
//                                     <p>제목: {post.title}</p>
//                                     <p>내용: {post.description}</p>
//                                 </div>
//                                 <button
//                                     className="bg-red-500 text-white px-2 py-1 rounded"
//                                     onClick={() => handleDeletePost(post._id)}
//                                 >
//                                     삭제
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>게시글 목록을 불러올 수 없습니다.</p>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default AdminDashboardPage;
// pages/AdminDashboardPage/index.jsx
import React, { useState } from "react";
import UserSection from "./Sections/UserSection";
import PostSection from "./Sections/PostSection";

const AdminDashboardPage = () => {
    const [section, setSection] = useState("users"); // 'users' or 'posts'

    return (
        <section className="p-4">
            <h2 className="text-xl font-bold mb-4">관리자 대시보드</h2>

            <div className="mb-6 space-x-2">
                <button
                    className={`px-4 py-2 rounded ${
                        section === "users" ? "bg-black text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setSection("users")}
                >
                    전체 사용자 보기
                </button>

                <button
                    className={`px-4 py-2 rounded ${
                        section === "posts" ? "bg-black text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setSection("posts")}
                >
                    전체 게시글 보기
                </button>
            </div>

            {/* 선택된 섹션 렌더링 */}
            {section === "users" && <UserSection />}
            {section === "posts" && <PostSection />}
        </section>
    );
};

export default AdminDashboardPage;
