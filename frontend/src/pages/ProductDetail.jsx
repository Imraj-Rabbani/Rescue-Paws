import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../index.css';

const mockProducts = [
  { id: 1, name: 'Quantum Pet Feeder', price: 129.99, discount: 15, image: '/QuantumFeeder.jpg', description: 'AI-powered meal scheduling', category: 'tech', featured: true },
  { id: 2, name: 'Smart Collar X9', price: 199.99, discount: 20, image: '/SmartColler.jpg', description: 'Real-time GPS tracking', category: 'tech', featured: true },
  { id: 3, name: 'Organic Superfood Mix', price: 39.99, image: '/SuperFood.jpg', description: 'Grain-free nutrition', category: 'food' },
  { id: 4, name: 'Neo Comfort Bed', price: 89.99, discount: 10, image: '/ComfortBed.jpg', description: 'Self-warming memory foam', category: 'accessories' },
  { id: 5, name: 'Holo-Interactive Toy', price: 34.99, image: '/PetToy.jpg', description: 'Laser projection toy', category: 'toys' },
  { id: 6, name: 'Bio-Grooming Kit', price: 49.99, discount: 25, image: '/GroomingKit.jpg', description: 'Eco-friendly grooming', category: 'health' },
  { id: 7, name: 'Hydration Smart Bowl', price: 59.99, image: '/SmartBowl.jpg', description: 'Auto-refill bowl', category: 'tech' },
  { id: 8, name: 'Air Purifier 360°', price: 149.99, image: '/AirPurifier.jpg', description: 'HEPA filtration', category: 'health' }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="p-8 text-red-500 text-center">Product not found</div>;

  const discountedPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const otherProducts = mockProducts.filter(p => p.id !== product.id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductNavbar />

      {/* Promo Banner */}
      <div className="bg-[AliceBlue] text-black text-center py-2 font-bold">
        ⚡ 20% OFF SMART PRODUCTS - USE CODE: PETTECH20 ⚡
      </div>

      {/* Product Details Section */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image and thumbnails */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow"
          />
          {/* Optional static thumbnails (simulated) */}
          <div className="flex gap-2 mt-4">
            <img src={product.image} alt="Thumb 1" className="w-20 h-20 rounded border" />
            <img src={product.image} alt="Thumb 2" className="w-20 h-20 rounded border" />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mb-4">
              {product.discount ? (
                <>
                  <div className="text-2xl font-semibold text-purple-600">${discountedPrice}</div>
                  <div className="text-gray-400 line-through text-sm">${product.price}</div>
                </>
              ) : (
                <div className="text-2xl font-semibold">${product.price}</div>
              )}
            </div>

            <div className="text-green-600 font-medium mb-4">In Stock</div>

            <label htmlFor="quantity" className="block mb-1 font-medium">Quantity</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mb-6 border rounded px-3 py-1 w-24"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <div className="space-y-3">
              <button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                onClick={() => alert(`Added ${quantity} item(s) to cart (mock)`)}
              >
                Add to Cart
              </button>
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
                onClick={() => navigate('/paynow')}
              >
                Buy Now
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">Ships from STRAY PAWS | 30-day return policy</p>
        </div>
      </div>

      {/* More Products Grid */}
      <div className="container mx-auto px-4 py-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Explore More Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
