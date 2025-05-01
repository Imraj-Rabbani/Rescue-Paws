import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';

const mockProducts = [
  { 
    id: 1, 
    name: 'Quantum Pet Feeder', 
    category: 'tech', 
    price: 129.99,
    image: '/QuantumFeeder.jpg',
    description: 'AI-powered automatic feeder with portion control'
  },
  { 
    id: 2, 
    name: 'Smart Collar X9', 
    category: 'tech', 
    price: 199.99,
    image: '/SmartColler.jpg',
    description: 'GPS tracking and activity monitoring collar'
  },
  { 
    id: 3, 
    name: 'Organic Superfood Mix', 
    category: 'food', 
    price: 39.99,
    image: '/SuperFood.jpg',
    description: 'Nutrient-rich organic food blend'
  },
  { 
    id: 4, 
    name: 'Neo Comfort Bed', 
    category: 'accessories', 
    price: 89.99,
    image: '/ComfortBed.jpg',
    description: 'Orthopedic memory foam pet bed'
  },
  { 
    id: 5, 
    name: 'Holo-Interactive Toy', 
    category: 'toys', 
    price: 34.99,
    image: '/PetToy.jpg',
    description: 'Laser projection interactive toy'
  },
  { 
    id: 6, 
    name: 'Bio-Grooming Kit', 
    category: 'health', 
    price: 49.99,
    image: '/GroomingKit.jpg',
    description: 'Complete grooming set with organic products'
  },
  { 
    id: 7, 
    name: 'Hydration Smart Bowl', 
    category: 'tech', 
    price: 59.99,
    image: '/SmartBowl.jpg',
    description: 'Automatic water refill and monitoring bowl'
  },
  { 
    id: 8, 
    name: 'Air Purifier 360°', 
    category: 'health', 
    price: 149.99,
    image: '/AirPurifier.jpg',
    description: 'HEPA air purifier for pet homes'
  }
];

const CategoryPage = () => {
  const { category } = useParams();
  
  const filteredProducts = mockProducts.filter(
    product => product.category.toLowerCase() === category.toLowerCase()
  );

  const categoryTitles = {
    tech: 'Smart Tech',
    food: 'Food & Treats',
    toys: 'Toys',
    health: 'Health',
    accessories: 'Accessories'
  };

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">
          {categoryTitles[category] || category} Products
        </h2>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
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