// import React from "react";

// const CheckBox = ({ items, checkedItems, onFilters }) => {
//     const handleToggle = (itemId) => {
//         const currentIndex = checkedItems.indexOf(itemId);
//         const newChecked = [...checkedItems];

//         if (currentIndex === -1) {
//             newChecked.push(itemId);
//         } else {
//             newChecked.splice(currentIndex, 1);
//         }

//         onFilters(newChecked);
//     };

//     return (
//         <div className="p-2 mb-3 bg-gray-100 rounded-md">
//             {items?.map((item) => (
//                 <div key={item._id}>
//                     <input
//                         type="checkbox"
//                         onChange={() => handleToggle(item._id)}
//                         checked={checkedItems.includes(item._id)}
//                     />
//                     <label className="ml-2">{item.name}</label>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default CheckBox;



// ✅ 수정된 CheckBox 컴포넌트
import React from "react";

const CheckBox = ({ items, checkedItems, onFilters }) => {
  const handleToggle = (itemId) => {
    const newChecked = checkedItems.includes(itemId)
      ? checkedItems.filter((id) => id !== itemId)
      : [...checkedItems, itemId];

    onFilters(newChecked);
  };

  return (
    <div className="p-2 mb-3 bg-gray-100 rounded-md">
      {items?.map((item) => (
        <div key={item._id} className="flex items-center">
          <input
            type="checkbox"
            onChange={() => handleToggle(item._id)}
            checked={checkedItems.includes(item._id)}
            id={`cat-${item._id}`}
          />
          <label htmlFor={`cat-${item._id}`} className="ml-2">
            {item.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckBox;