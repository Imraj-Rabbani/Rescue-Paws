import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { AppContext } from '../context/AppContext';

const CategoryPage = () => {
  const { category } = useParams();
  const { productData, productLoading } = useContext(AppContext);

  const filtered = productData.filter(p =>
    p.category?.toLowerCase() === category.toLowerCase()
  );

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">
          {category.charAt(0).toUpperCase() + category.slice(1)} Products
        </h2>

        {productLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
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
