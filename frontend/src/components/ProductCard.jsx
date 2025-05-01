import React from "react";
import { FiStar } from "react-icons/fi";
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const discountedPrice = product.discount
    ? (product.sellingPrice * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative">
          <img
            src={product.imageUrl} // ✅ uses DB field
            alt={product.name}
            className="h-48 w-full object-cover"
          />
          {product.discount && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

          <p className="text-sm text-gray-600 mb-4">{product.description}</p>

          <div className="mt-auto">
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-purple-600">BDT {discountedPrice}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">BDT {product.sellingPrice}</span>
              </div>
            ) : (
              <div className="text-lg font-bold text-gray-900">BDT {product.sellingPrice}</div>
            )}

            <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
