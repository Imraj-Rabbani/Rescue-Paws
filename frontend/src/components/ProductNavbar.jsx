import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import { useSearch } from '../context/SearchContext';

export default function ProductNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
  e.preventDefault();
  const term = searchTerm.trim();
  if (term) {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setSearchTerm('');
  }
};
  return (
    <>
      {/* Promo Bar */}
      <div className="bg-[Cornsilk] text-black text-center py-2 px-4 text-sm">
        ✨ Premium pet products with 10% donated to animal rescues ✨
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Row */}
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo_new.png" alt="STRAY PAWS" className="h-10" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-black hidden sm:block">
                STRAY PAWS
              </span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search smart collars, eco beds..."
                  className="w-full px-5 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="md:hidden text-gray-700"
              >
                <FiSearch className="h-6 w-6" />
              </button>

              <Link to="/account" className="hidden md:block text-gray-700 hover:text-purple-600">
                <FiUser className="h-6 w-6" />
              </Link>

              <div className="relative">
                <Link to="/cart" className="text-gray-700 hover:text-purple-600">
                  <FiShoppingCart className="h-6 w-6" />
                </Link>
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="md:hidden mb-3 px-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>
          )}

          {/* Desktop Category Navigation */}
          <div className="hidden md:flex space-x-6 py-3 border-t border-gray-100">
            <Link to="/products" className="text-purple-600 font-medium flex items-center">
              <span className="mr-1">🏠</span> All Products
            </Link>
            <Link to="/products/category/food" className="text-gray-600 hover:text-purple-600 flex items-center">
              <span className="mr-1">🍗</span> Food & Treats
            </Link>
            <Link to="/products/category/tech" className="text-gray-600 hover:text-purple-600 flex items-center">
              <span className="mr-1">📱</span> Smart Tech
            </Link>
            <Link to="/products/category/toys" className="text-gray-600 hover:text-purple-600 flex items-center">
              <span className="mr-1">🎾</span> Toys
            </Link>
            <Link to="/products/category/health" className="text-gray-600 hover:text-purple-600 flex items-center">
              <span className="mr-1">❤️</span> Health
            </Link>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/products" 
                  className={`${location.pathname === '/products' ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
                >
                  All Products
                </Link>
                <Link 
                  to="/products/food" 
                  className={`${location.pathname.startsWith('/products/food') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
                >
                  Food & Treats
                </Link>
                <Link 
                  to="/products/tech" 
                  className={`${location.pathname.startsWith('/products/tech') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
                >
                  Smart Tech
                </Link>
                <Link 
                  to="/products/toys" 
                  className={`${location.pathname.startsWith('/products/toys') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
                >
                  Toys
                </Link>
                <Link 
                  to="/products/health" 
                  className={`${location.pathname.startsWith('/products/health') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
                >
                  Health
                </Link>
                <Link 
                  to="/account" 
                  className="text-gray-600"
                >
                  My Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}