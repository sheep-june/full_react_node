// import React from "react";

// const SearchInput = ({ onSearch, searchTerm }) => {
//     return (
//         <input
//             className="p-2 border border-gray-300 rounded-md"
//             type="text"
//             placeholder="검색하세요."
//             onChange={onSearch}
//             value={searchTerm}
//         />
//     );
// };

// export default SearchInput;
import React from "react";

const RadioBox = ({ prices, checkedPrice, onFilters }) => {
  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    onFilters(selectedId);
  };

  return (
    <div className="p-4 mb-4 bg-white border border-[#00C4C4] rounded-md">
      <h3 className="font-semibold text-[#00C4C4] mb-2">가격대</h3>
      {prices?.map((price) => (
        <div key={price._id} className="flex items-center mb-1">
          <input
            type="radio"
            id={`price-${price._id}`}
            value={price._id}
            checked={checkedPrice === price._id}
            onChange={handleChange}
            className="accent-[#00C4C4]"
          />
          <label htmlFor={`price-${price._id}`} className="ml-2 text-sm text-gray-700">
            {price.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioBox;
