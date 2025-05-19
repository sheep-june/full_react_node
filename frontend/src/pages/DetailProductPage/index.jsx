// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../../utils/axios";
// import Productimage from "./Sections/Productimage";
// import ProductInfo from "./Sections/ProductInfo";

// const DetailProductPage = () => {
//     const { productId } = useParams();

//     const [product, setProduct] = useState(null);

//     useEffect(() => {
//         async function fetchProduct() {
//             try {
//                 const response = await axiosInstance.get(
//                     `/products/${productId}?type=single`
//                 );
//                 setProduct(response.data[0]);
//                 console.log(response);
//             } catch (error) {
//                 console.error(error);
//             }
//         }

//         fetchProduct();
//     }, [productId]);
//     if (!product) return null;

//     return (
//         <section>
//             <div className="text-center">
//                 <h1 className="p-4 text-2xl">{product.title}</h1>
//             </div>

//             <div className="flex gap-4">
//                 <div className="w-1/2">
//                     <Productimage product={product} />
//                 </div>
//                 <div className="w-1/2">
//                     <ProductInfo product={product} />
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DetailProductPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import ProductImage from "./Sections/Productimage";
import ProductInfo from "./Sections/ProductInfo";

const DetailProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axiosInstance.get(
                    `/products/${productId}?type=single`
                );
                setProduct(response.data[0]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProduct();
    }, [productId]);

    if (!product) return null;

    return (
        <section className="max-w-6xl mx-auto p-4">
            <div className="text-center">
                <h1 className="p-4 text-2xl">{product.title}</h1>
            </div>

            {/* 좌우로 나뉜 기본 정보 영역 */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                    <ProductImage product={product} />
                </div>
                <div className="w-full lg:w-1/2">
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* 아래로 분리된 긴 설명 영역 */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">상품 설명</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {product.description}
                </p>
            </div>
        </section>
    );
};

export default DetailProductPage;
