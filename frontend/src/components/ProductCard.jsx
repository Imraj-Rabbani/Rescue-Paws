import React from "react";
import { FiStar } from "react-icons/fi";
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.image} 
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
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
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
                ${(product.price * (1 - product.discount/100)).toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-900">${product.price}</div>
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