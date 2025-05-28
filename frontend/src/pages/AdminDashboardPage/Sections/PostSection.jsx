// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PostSection = () => {
//     const [posts, setPosts] = useState([]);
//     const [search, setSearch] = useState("");
//     const token = localStorage.getItem("adminToken");

//     const fetchPosts = async () => {
//         try {
//             const res = await axios.get("/api/admin/posts", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPosts(res.data);
//         } catch (err) {
//             console.error("게시글 불러오기 실패", err);
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
//         fetchPosts();
//     }, []);

//     const filteredPosts = posts.filter((post) =>
//         post.title.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     placeholder="제목으로 검색"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="border p-2 w-full"
//                 />
//             </div>

//             <ul className="space-y-2">
//                 {filteredPosts.map((post) => (
//                     <li
//                         key={post._id}
//                         className="flex justify-between border p-2"
//                     >
//                         <div>
//                             <p>제목: {post.title}</p>
//                             <p>내용: {post.description}</p>
//                         </div>
//                         <button
//                             className="bg-red-500 text-white px-2 py-1 rounded"
//                             onClick={() => handleDeletePost(post._id)}
//                         >
//                             삭제
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default PostSection;


import React, { useEffect, useState } from "react";
import axios from "axios";

const POSTS_PER_PAGE = 10;

const PostSection = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem("adminToken");

    const fetchPosts = async () => {
        try {
            const res = await axios.get("/api/admin/posts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(res.data);
        } catch (err) {
            console.error("게시글 불러오기 실패", err);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/api/admin/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts();
        } catch (err) {
            console.error("게시글 삭제 실패", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

    return (
        <div>
            {/* 🔍 검색창 */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="제목으로 검색"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border border-[#00C4C4] p-2 w-full rounded focus:outline-none focus:border-2 focus:border-[#00C4C4]"
                />
            </div>

            {/* 📝 게시글 목록 */}
            <ul className="space-y-2">
                {currentPosts.map((post) => (
                    <li
                        key={post._id}
                        className="flex items-center justify-between border border-[#00C4C4] p-3 rounded"
                    >
                        <div className="w-full pr-4">
                            <p className="font-semibold">제목: {post.title}</p>
                            <p className="text-gray-700 truncate max-w-[500px]">
                                내용: {post.description}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <button
                                className="px-3 py-1 border border-red-500 text-red-500 bg-white rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                                onClick={() => handleDeletePost(post._id)}
                            >
                                삭제
                            </button>
                        </div>
                    </li>
                ))}
            </ul>


            {/* 📄 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded transition-colors duration-200 ${currentPage === i + 1
                                    ? "bg-[#00C4C4] text-white border-[#00C4C4]"
                                    : "bg-white text-[#00C4C4] border-[#00C4C4] hover:bg-[#00C4C4] hover:text-white"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostSection;
