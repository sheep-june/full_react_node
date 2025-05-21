// ✅ src/pages/SearchPage/index.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CheckBox from "../LandingPage/Sections/CheckBox";
import RadioBox from "../LandingPage/Sections/RadioBox";
import CardItem from "../LandingPage/Sections/CardItem";
import { categories, prices } from "../../utils/filterData";
import axiosInstance from "../../utils/axios";
import { useSelector } from "react-redux";

const SearchPage = () => {
    const user = useSelector((state) => state.user);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialSearch = searchParams.get("query") || "";
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [filters, setFilters] = useState({ categories: [], price: [] });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (initialSearch) {
            fetchSearchResults(initialSearch, filters);
        }
    }, [filters]);

    const fetchSearchResults = async (term = searchTerm, appliedFilters = filters) => {
        try {
            const res = await axiosInstance.get("/products", {
                params: {
                    searchTerm: term,
                    filters: appliedFilters,
                },
            });
            setProducts(res.data.products);
        } catch (err) {
            console.error("검색 실패:", err);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${searchTerm}`);
        fetchSearchResults(searchTerm, filters);
    };

    const handleFilters = (newData, type) => {
        const newFilters = { ...filters };
        newFilters[type] = type === "price" ? getPriceRange(newData) : newData;
        setFilters(newFilters);
    };

    const getPriceRange = (id) => {
        const priceObj = prices.find((item) => item._id === parseInt(id));
        return priceObj ? priceObj.array : [];
    };

    return (
        <section className="w-full px-4">
            {/* 검색창 */}
            <form onSubmit={handleSearchSubmit} className="mb-4 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="border p-2 w-full max-w-xl rounded-l"
                    placeholder="검색어를 입력하세요"
                />
                <button
                    type="submit"
                    className="bg-black text-white px-4 rounded-r"
                >
                    검색
                </button>
            </form>

            <div className="flex gap-6">
                {/* 좌측 필터는 유지 */}
                <div className="w-[250px] space-y-4">
                    <div>
                        <h3 className="font-semibold mb-1">카테고리</h3>
                        <CheckBox
                            items={categories}
                            checkedItems={filters.categories}
                            onFilters={(filters) => handleFilters(filters, "categories")}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">가격</h3>
                        <RadioBox
                            prices={prices}
                            checkedPrice={
                                prices.find((p) =>
                                    JSON.stringify(p.array) === JSON.stringify(filters.price)
                                )?._id || 0
                            }
                            onFilters={(filters) => handleFilters(filters, "price")}
                        />
                    </div>
                </div>

                {/* 우측 상품 결과 */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <CardItem
                                key={product._id}
                                product={product}
                                refreshWishlist={() => {}}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchPage;
