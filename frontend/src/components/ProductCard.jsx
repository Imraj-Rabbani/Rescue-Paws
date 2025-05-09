import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, backendUrl } = useContext(AppContext);
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products/${product.id}`);
        setStockQuantity(response.data.stockQuantity);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStock();
  }, [backendUrl, product.id]);

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (stockQuantity > 0) {
      addToCart(product, 1);
    }
  };

  const inStock = stockQuantity > 0;

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

          <p className="text-sm text-gray-600 mb-2">{product.description}</p>

          {/* PetPoints */}
          <div className="flex items-center gap-2 text-purple-700 font-semibold mt-1">
            <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
            <span>{product.sellingPrice.toFixed(2)}</span>
            <span>PetPoints</span>
          </div>

          {/* Stock Display */}
          <p className={`text-sm mt-2 ${inStock ? "text-green-600" : "text-red-600"}`}>
            {inStock ? `In Stock (${stockQuantity})` : "Out of Stock"}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`mt-4 w-full text-white py-2 rounded-lg font-medium transition ${
            inStock
              ? "bg-gray-900 hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
