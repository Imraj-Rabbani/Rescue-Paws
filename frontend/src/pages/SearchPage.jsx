import React, { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { getAllProducts } from '../services/ProductService';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';

const SearchPage = () => {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const results = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Search Results for "{searchTerm}"</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : results.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
