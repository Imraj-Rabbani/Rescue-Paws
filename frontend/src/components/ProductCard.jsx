import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { AppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);

  const handleCardClick = () => {
    if (product.id || product._id) {
      navigate(`/products/${product.id || product._id}`);
    } else {
      console.warn("Product ID missing for:", product.name);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.stockQuantity > 0) {
      addToCart(product, 1);
    }
  };

  const inStock = product.stockQuantity > 0;

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-70 p-2"
          loading="lazy"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

          {product.rating > 0 && (
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

          {typeof product.sellingPrice === 'number' && product.sellingPrice > 0 && (
            <div className="flex items-center gap-2 text-purple-700 font-semibold mt-1">
              <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
              <span>{product.sellingPrice.toFixed(2)}</span>
              <span>PetPoints</span>
            </div>
          )}

          <p className={`text-sm mt-2 ${inStock ? "text-green-600" : "text-red-600"}`}>
            {inStock ? `In Stock (${product.stockQuantity})` : "Out of Stock"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`mt-4 w-full text-white py-2 rounded-lg font-medium transition ${
            inStock ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
