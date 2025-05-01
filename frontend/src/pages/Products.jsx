// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { getAllProducts } from '../services/ProductService'; // ✅ real fetch
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar.jsx';
import SimpleCarousel from '../components/SimpleCarousel.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory); // Optional: add `category` in schema

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductNavbar />

      <div className="bg-[AliceBlue] text-black text-center py-2 font-bold relative mt-1">
        ⚡ 20% OFF SMART PRODUCTS - USE CODE: PETTECH20 ⚡
      </div>
      <SimpleCarousel />

      <div className="container mx-auto px-12 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">All Products</h1>

        <div className="mb-8 flex gap-4">
          {['all', 'tech', 'food', 'toys', 'health', 'accessories'].map((category) => (
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

        {loading ? (
          <div className="grid grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
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
