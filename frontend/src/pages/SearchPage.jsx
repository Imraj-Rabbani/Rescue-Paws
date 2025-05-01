import React from 'react';
import { useSearch } from '../context/SearchContext';
import ProductCard from '../components/ProductCard';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';

const mockProducts = [
  { 
    id: 1, 
    name: 'Quantum Pet Feeder', 
    category: 'tech', 
    price: 129.99,
    image: '/QuantumFeeder.jpg'  // Matches your actual file name
  },
  { 
    id: 2, 
    name: 'Smart Collar X9', 
    category: 'tech', 
    price: 199.99,
    image: '/SmartColler.jpg'    // Note: Your file is "SmartColler.jpg" (double L)
  },
  { 
    id: 3, 
    name: 'Organic Superfood Mix', 
    category: 'food', 
    price: 39.99,
    image: '/SuperFood.jpg'
  },
  { 
    id: 4, 
    name: 'Neo Comfort Bed', 
    category: 'accessories', 
    price: 89.99,
    image: '/ComfortBed.jpg'
  },
  { 
    id: 5, 
    name: 'Holo-Interactive Toy', 
    category: 'toys', 
    price: 34.99,
    image: '/PetToy.jpg'
  },
  { 
    id: 6, 
    name: 'Bio-Grooming Kit', 
    category: 'health', 
    price: 49.99,
    image: '/GroomingKit.jpg'
  },
  { 
    id: 7, 
    name: 'Hydration Smart Bowl', 
    category: 'tech', 
    price: 59.99,
    image: '/SmartBowl.jpg'
  },
  { 
    id: 8, 
    name: 'Air Purifier 360°', 
    category: 'health', 
    price: 149.99,
    image: '/AirPurifier.jpg'
  }
];

const SearchPage = () => {
  const { searchTerm } = useSearch(); // Changed from query to searchTerm
  const results = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ProductNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Search Results for "{searchTerm}"</h2>
        {results.length ? (
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