// pages/AdminDashboardPage/Sections/UserSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserSection = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("adminToken");

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        } catch (err) {
            console.error("유저 불러오기 실패", err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("정말로 이 유저를 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (err) {
            console.error("유저 삭제 실패", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="이메일로 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>

            <ul className="space-y-2">
                {filteredUsers.map((user) => (
                    <li
                        key={user._id}
                        className="flex justify-between border p-2"
                    >
                        <div>
                            <p>이름: {user.name}</p>
                            <p>이메일: {user.email}</p>
                        </div>
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleDeleteUser(user._id)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSection;
