import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import { getAllProducts } from '../services/ProductService';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryTitles = {
    tech: 'Smart Tech',
    food: 'Food & Treats',
    toys: 'Toys',
    health: 'Health',
    accessories: 'Accessories'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await getAllProducts();
        const filtered = all.filter(p =>
          p.category?.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">
          {categoryTitles[category] || category} Products
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
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
