import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CheckBox from "../LandingPage/Sections/CheckBox";
import RadioBox from "../LandingPage/Sections/RadioBox";
import CardItem from "../LandingPage/Sections/CardItem";
import { categories, prices } from "../../utils/filterData";
import axiosInstance from "../../utils/axios";

const sortOptions = [
  { id: "views", label: "조회순" },
  { id: "rating", label: "별점순" },
  { id: "lowPrice", label: "가격 낮은순" },
  { id: "highPrice", label: "가격 높은순" },
  { id: "sold", label: "판매순" }, // ✅ 추가
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSearch = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState({ continents: [], price: [] }); // ✅ 수정
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("views");

  useEffect(() => {
    if (initialSearch) {
      fetchSearchResults(initialSearch, filters, sortBy);
    }
  }, []);

  useEffect(() => {
    if (initialSearch) {
      fetchSearchResults(initialSearch, filters, sortBy);
    }
  }, [filters, sortBy]);

  const fetchSearchResults = async (
    term = searchTerm,
    appliedFilters = filters,
    sort = sortBy
  ) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: {
          searchTerm: term,
          filters: appliedFilters,
          sort,
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
    fetchSearchResults(searchTerm, filters, sortBy);
  };

  const handleFilters = (newData, type) => {
    const newFilters = { ...filters };

    // ✅ 카테고리는 서버 DB 필드명이 'continents'
    const key = type === "categories" ? "continents" : type;

    newFilters[key] =
      type === "price" ? getPriceRange(newData) : newData;

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
        <button type="submit" className="bg-black text-white px-4 rounded-r">
          검색
        </button>
      </form>

      <div className="flex gap-6">
        {/* 좌측 필터 */}
        <div className="w-[250px] space-y-4">
          <div>
            <h3 className="font-semibold mb-1">카테고리</h3>
            <CheckBox
              items={categories}
              checkedItems={filters.continents}
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
          {/* 정렬 탭 */}
          <div className="flex gap-4 mb-4 border-b pb-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`text-sm px-2 py-1 rounded border-b-2 transition-all duration-150 ${
                  sortBy === option.id
                    ? "border-black font-semibold"
                    : "border-transparent text-gray-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

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
