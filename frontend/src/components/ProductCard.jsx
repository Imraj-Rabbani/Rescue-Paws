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
    
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-70 p-2"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
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

          {/* PetPoints */}
          <div className="flex items-center gap-2 text-purple-700 font-semibold mt-2">
            <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
            <span>{product.sellingPrice.toFixed(2)}</span>
            <span>PetPoints</span>
          </div>
        </div>

        {/* Button always at bottom */}
        <button
          className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
