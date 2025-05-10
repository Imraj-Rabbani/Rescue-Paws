import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

const CategoryPage = () => {
  const { category } = useParams();
  const { productData, productLoading } = useContext(AppContext);

  const categoryTitles = {
    tech: 'Smart Tech',
    food: 'Food & Treats',
    toys: 'Toys',
    health: 'Health',
    accessories: 'Accessories'
  };

  // ✅ Memoize for performance
  const filteredProducts = useMemo(() => {
    return productData.filter(
      p => p.category?.toLowerCase() === category.toLowerCase()
    );
  }, [productData, category]);

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">
          {categoryTitles[category] || category} Products
        </h2>

        {productLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
