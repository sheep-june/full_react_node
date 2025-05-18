import React, { useEffect, useState } from "react";
import axios from "axios";

const PostSection = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
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

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="제목으로 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>

            <ul className="space-y-2">
                {filteredPosts.map((post) => (
                    <li
                        key={post._id}
                        className="flex justify-between border p-2"
                    >
                        <div>
                            <p>제목: {post.title}</p>
                            <p>내용: {post.description}</p>
                        </div>
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleDeletePost(post._id)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostSection;
