import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../components/FileUpload";

const continents = [
    { key: 1, value: "패션의류/잡화" },
    { key: 2, value: "뷰티" },
    { key: 3, value: "출산/유아동" },
    { key: 4, value: "식품" },
    { key: 5, value: "주방용품" },
    { key: 6, value: "생활용품" },
    { key: 7, value: "홈인테리어" },
    { key: 8, value: "가전디지털" },
    { key: 9, value: "스포츠/레저" },
    { key: 10, value: "자동차용품" },
    { key: 11, value: "도서/음반/DVD" },
    { key: 12, value: "완구/취미" },
    { key: 13, value: "문구/오피스" },
    { key: 14, value: "반려동물용품" },
    { key: 15, value: "헬스/건강식품" },
];

const UploadProductPage = () => {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        price: 0,
        continents: 1,
        images: [],
    });

    const userData = useSelector((state) => state.user?.userData);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImages = (newImages) => {
        setProduct((prevState) => ({
            ...prevState,
            images: newImages,
        }));
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
        writer: userData.id,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.continents, // ✅ 여기서 category로 보냄
        images: product.images,
    };

    try {
        await axiosInstance.post("/products", body);
        navigate("/");
    } catch (error) {
        console.error(error);
    }
};


    return (
        <section>
            <div className="text-center m-7">
                <h1>상품 업로드</h1>
            </div>

            <form
                className="mt-6"
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    // 엔터키로 submit 방지 (textarea 제외)
                    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                        e.preventDefault();
                    }
                }}
            >
                <FileUpload
                    images={product.images}
                    onImageChange={handleImages}
                />

                <div className="mt-4">
                    <label htmlFor="title">상품명</label>
                    <input
                        className="w-full px-4 py-2 bg-white border rounded-md"
                        name="title"
                        id="title"
                        onChange={handleChange}
                        value={product.title}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="price">가격</label>
                    <input
                        className="w-full px-4 py-2 bg-white border rounded-md"
                        type="number"
                        name="price"
                        id="price"
                        onChange={handleChange}
                        value={product.price}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="continents">카테고리</label>
                    <select
                        className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                        name="continents"
                        id="continents"
                        onChange={handleChange}
                        value={product.continents}
                    >
                        {continents.map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.value}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
                    <label htmlFor="description">상품 설명</label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                        rows={6}
                        placeholder="상품에 대한 설명을 입력하세요"
                        onChange={handleChange}
                        value={product.description}
                    />
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700"
                    >
                        생성하기
                    </button>
                </div>
            </form>
        </section>
    );
};

export default UploadProductPage;
