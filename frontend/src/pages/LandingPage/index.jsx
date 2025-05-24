import React, { useEffect, useState } from "react";
// import CheckBox from "./Sections/CheckBox";
// import RadioBox from "./Sections/RadioBox";
// import SearchInput from "./Sections/SearchInput";
import CardItem from "./Sections/CardItem";
import axiosInstance, { setCsrfToken } from "../../utils/axios";
// import { categories, prices } from "../../utils/filterData";
import { prices } from "../../utils/filterData";
// import { useSelector } from "react-redux";
import AdSlider from "../../components/AdSlider/AdSlider";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const limit = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    price: [],
  });

  const [quickSearch, setQuickSearch] = useState("");

  useEffect(() => {
    setCsrfToken();
    fetchProducts({ skip, limit });
  }, [skip]);

  const fetchProducts = async ({
    skip,
    limit,
    loadMore = false,
    filters = {},
    searchTerm = "",
  }) => {
    try {
      const params = { skip, limit, filters, searchTerm };
      const response = await axiosInstance.get("/products", { params });

      if (loadMore) {
        setProducts((prev) => [...prev, ...response.data.products]);
      } else {
        setProducts(response.data.products);
      }

      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    const body = {
      skip: skip + limit,
      limit,
      loadMore: true,
      filters,
      searchTerm,
    };

    fetchProducts(body);
    setSkip(skip + limit);
  };

  const handleFilters = (newFilteredData, category) => {
    const newFilters = { ...filters };
    newFilters[category] = newFilteredData;

    if (category === "price") {
      const priceValues = handlePrice(newFilteredData);
      newFilters[category] = priceValues;
    }

    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  const handlePrice = (value) => {
    let array = [];

    for (let key in prices) {
      if (prices[key]._id === parseInt(value, 10)) {
        array = prices[key].array;
      }
    }

    return array;
  };

  const showFilteredResults = (filters) => {
    const body = {
      skip: 0,
      limit,
      filters,
      searchTerm,
    };

    fetchProducts(body);
    setSkip(0);
  };

  const handleSearchTerm = (event) => {
    const body = {
      skip: 0,
      limit,
      filters,
      searchTerm: event.target.value,
    };

    setSkip(0);
    setSearchTerm(event.target.value);
    fetchProducts(body);
  };

  const handleQuickSearch = (e) => {
    if (e.key === "Enter" && quickSearch.trim()) {
      navigate(`/search?query=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  const handleClickSearch = () => {
    if (quickSearch.trim()) {
      navigate(`/search?query=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <section>
      <div className="flex justify-center items-center gap-2 mt-8 mb-5">
        <input
          type="text"
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          onKeyDown={handleQuickSearch}
          placeholder="상품을 검색해보세요"
          className="w-full max-w-md border border-[#00C4C4] p-2 rounded-md"
        />
        <button
          onClick={handleClickSearch}
          className="px-4 py-2 bg-white text-[#00C4C4] border border-[#00C4C4] rounded hover:bg-gray-100"
        >
          검색
        </button>
      </div>

      <AdSlider />

      {/* <div className="flex gap-3">
        <div className="w-1/2">
          <CheckBox
            items={categories}
            checkedItems={filters.categories}
            onFilters={(filters) => handleFilters(filters, "categories")}
          />
        </div>

        <div className="w-1/2">
          <RadioBox
            prices={prices}
            checkedPrice={filters.price}
            onFilters={(filters) => handleFilters(filters, "price")}
          />
        </div>
      </div> */}

      {/* <div className="flex justify-end mb-3">
        <SearchInput
          searchTerm={searchTerm}
          onSearch={handleSearchTerm}
        />
      </div> */}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
          <CardItem product={product} key={product._id} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
          >
            더 보기
          </button>
        </div>
      )}
    </section>
  );
};

export default LandingPage;

