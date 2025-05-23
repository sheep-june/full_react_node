// import React from "react";

// const RadioBox = ({ prices, checkedPrice, onFilters }) => {
//     return (
//         <div className="p-2 mb-3 bg-gray-100 rounded-md">
//             {prices?.map((price) => (
//                 <div key={price._id}>
//                     <input
//                         checked={checkedPrice === price.array}
//                         onChange={(e) => onFilters(e.target.value)}
//                         type="radio"
//                         id={price._id}
//                         value={price._id}
//                     />{" "}
//                     <label htmlFor={price._id}>{price.name}</label>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default RadioBox;


// ✅ 수정된 RadioBox 컴포넌트
import React from "react";

const RadioBox = ({ prices, checkedPrice, onFilters }) => {
  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    onFilters(selectedId);
  };

  return (
    <div className="p-2 mb-3 bg-gray-100 rounded-md">
      {prices?.map((price) => (
        <div key={price._id} className="flex items-center">
          <input
            type="radio"
            id={`price-${price._id}`}
            value={price._id}
            checked={checkedPrice === price._id}
            onChange={handleChange}
          />
          <label htmlFor={`price-${price._id}`} className="ml-2">
            {price.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioBox;