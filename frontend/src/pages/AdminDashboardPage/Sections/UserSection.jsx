// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const UserSection = () => {
//     const [users, setUsers] = useState([]);
//     const [search, setSearch] = useState("");
//     const token = localStorage.getItem("adminToken");

//     const fetchUsers = async () => {
//         try {
//             const res = await axios.get("/api/admin/users", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setUsers(res.data);
//         } catch (err) {
//             console.error("유저 불러오기 실패", err);
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

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const filteredUsers = users.filter((user) =>
//         user.email.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     placeholder="이메일로 검색"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="border p-2 w-full"
//                 />
//             </div>

//             <ul className="space-y-2">
//                 {filteredUsers.map((user) => (
//                     <li
//                         key={user._id}
//                         className="flex justify-between border p-2"
//                     >
//                         <div>
//                             <p>이름: {user.name}</p>
//                             <p>이메일: {user.email}</p>
//                         </div>
//                         <button
//                             className="px-2 py-1 border border-red-500 text-red-500 bg-white rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
//                             onClick={() => handleDeleteUser(user._id)}
//                         >
//                             삭제
//                         </button>

//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default UserSection;


import React, { useEffect, useState } from "react";
import axios from "axios";

const USERS_PER_PAGE = 10;

const UserSection = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
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

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const startIdx = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIdx, startIdx + USERS_PER_PAGE);

    return (
        <div>
            {/* 🔍 검색창 */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="이메일로 검색"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // 검색 시 첫 페이지로
                    }}
                    className="border border-[#00C4C4] p-2 w-full rounded focus:outline-none focus:border-2 focus:border-[#00C4C4]"
                />
            </div>

            {/* 👥 사용자 목록 */}
            <ul className="space-y-2">
                {currentUsers.map((user) => (
                    <li
                        key={user._id}
                        className="flex justify-between border border-[#00C4C4] p-3 rounded items-center"
                    >
                        <div>
                            <p className="font-semibold">이름: {user.name}</p>
                            <p className="text-gray-700">이메일: {user.email}</p>
                        </div>
                        <button
                            className="px-3 py-1 border border-red-500 text-red-500 bg-white rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                            onClick={() => handleDeleteUser(user._id)}
                        >
                            삭제
                        </button>
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
                            className={`px-3 py-1 border rounded transition-colors duration-200 ${
                                currentPage === i + 1
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

export default UserSection;
