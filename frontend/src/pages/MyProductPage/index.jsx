// // 📁 src/pages/MyProductsPage/index.jsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axios";
// import { Link } from "react-router-dom";

// const MyProductsPage = () => {
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchMyProducts = async () => {
//             try {
//                 const res = await axiosInstance.get("/users/myproducts");
//                 setProducts(res.data.products);
//             } catch (error) {
//                 console.error("내가 올린 상품 불러오기 실패:", error);
//             }
//         };

//         fetchMyProducts();
//     }, []);

//     return (
//         <section className="max-w-4xl mx-auto p-4">
//             <h2 className="text-2xl font-semibold mb-6 text-center">
//                 내가 올린 상품
//             </h2>

//             {products.length === 0 ? (
//                 <p className="text-center text-gray-500">
//                     등록한 상품이 없습니다.
//                 </p>
//             ) : (
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {products.map((product) => (
//                         <li
//                             key={product._id}
//                             className="border rounded-md p-4 shadow hover:shadow-md"
//                         >
//                             <img
//                                 src={`http://localhost:4000/uploads/${product.images[0]}`}
//                                 alt={product.title}
//                                 className="w-full h-40 object-cover mb-2 rounded"
//                             />

//                             <h3 className="text-lg font-bold mb-1">
//                                 {product.title}
//                             </h3>
//                             <p className="text-sm text-gray-700 mb-1">
//                                 ₩{product.price.toLocaleString()}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 등록일:{" "}
//                                 {new Date(
//                                     product.createdAt
//                                 ).toLocaleDateString()}
//                             </p>
//                             <Link
//                                 to={`/product/${product._id}`}
//                                 className="inline-block mt-2 text-blue-600 hover:underline text-sm"
//                             >
//                                 상세보기
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </section>
//     );
// };

// export default MyProductsPage;

// 📁 src/pages/MyProductsPage/index.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";

const MyProductsPage = () => {
    const [products, setProducts] = useState([]);

    const fetchMyProducts = async () => {
        try {
            const res = await axiosInstance.get("/users/myproducts");
            setProducts(res.data.products);
        } catch (error) {
            console.error("내가 올린 상품 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axiosInstance.delete(`/products/${id}`, {
                headers: {
                    // CSRF 토큰 명시적으로 첨부
                    "X-CSRF-Token":
                        axiosInstance.defaults.headers.common["X-CSRF-Token"],
                },
            });

            alert("삭제되었습니다.");
            fetchMyProducts(); // 삭제 후 목록 갱신
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <section className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                내가 올린 상품
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-500">
                    등록한 상품이 없습니다.
                </p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <li
                            key={product._id}
                            className="border rounded-md p-4 shadow hover:shadow-md"
                        >
                            <img
                                src={`http://localhost:4000/uploads/${product.images[0]}`}
                                alt={product.title}
                                className="w-full h-40 object-cover mb-2 rounded"
                            />
                            <h3 className="text-lg font-bold mb-1">
                                {product.title}
                            </h3>
                            <p className="text-sm text-gray-700 mb-1">
                                ₩{product.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                등록일:{" "}
                                {new Date(
                                    product.createdAt
                                ).toLocaleDateString()}
                            </p>
                            <div className="flex justify-between mt-2">
                                <Link
                                    to={`/product/${product._id}`}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    상세보기
                                </Link>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default MyProductsPage;
