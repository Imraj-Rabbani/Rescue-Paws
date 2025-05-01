// src/components/ProductCard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    alert(`${product.name} has been added to your cart.`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">{product.description}</p>

        {/* Price */}
        <div className="mt-auto">
          {product.discount ? (
            <div className="flex items-center">
              <span className="text-lg font-bold text-purple-600">
                $ {(product.sellingPrice * (1 - product.discount / 100)).toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                $ {product.sellingPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-900">
              $ {product.sellingPrice.toFixed(2)}
            </div>
          )}

          <button
            className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;