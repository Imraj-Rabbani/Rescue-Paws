// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import SimpleCarousel from '../components/SimpleCarousel';

const Products = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductNavbar />

      {/* ✅ Carousel appears at top */}
      <SimpleCarousel />

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">All Products</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-10 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
