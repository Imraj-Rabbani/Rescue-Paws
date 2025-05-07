import React, { useContext } from 'react';
import { useSearch } from '../context/SearchContext';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';

const SearchPage = () => {
  const { searchTerm } = useSearch();
  const { productData, productLoading } = useContext(AppContext);

  const results = productData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">
          Search Results for "{searchTerm}"
        </h2>

        {productLoading && productData.length === 0 ? (
          <div className="text-gray-500">Loading...</div>
        ) : results.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
