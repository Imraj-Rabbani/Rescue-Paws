// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.css";
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../index.css';
import ProductNavbar from '../components/ProductNavbar.jsx';
import SimpleCarousel from '../components/SimpleCarousel.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
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
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductNavbar />
      
      <div className="bg-[AliceBlue] text-black text-center py-2 font-bold relative mt-1">
        ⚡ 20% OFF SMART PRODUCTS - USE CODE: PETTECH20 ⚡
      </div>
      <SimpleCarousel/>
      <div className="container mx-auto px-12 py-12">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">All Products</h1>

        {/* Category Filter (Desktop only) */}
        <div className="mb-8 flex gap-4">
          {['all', 'tech', 'food', 'toys', 'health', 'accessories'].map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-medium ${
                activeCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
