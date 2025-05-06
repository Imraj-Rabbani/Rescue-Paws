import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import { useSearch } from '../context/SearchContext';
import { AppContext } from '../context/AppContext';

export default function ProductNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const { cart, isLoggedIn, userData, backendUrl, resetCart } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const userMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // ✅ Clear cart in memory
      resetCart();

      // ✅ Optionally remove stored cart for security
      localStorage.removeItem('cart');

      // ✅ Remove auth-related keys if any
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

      // ✅ Full reload
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <div className="bg-[Cornsilk] text-black text-center py-2 px-4 text-sm">
        ✨ Premium pet products with 10% donated to animal rescues ✨
      </div>

      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo_new.png" alt="STRAY PAWS" className="h-10" />
              <span className="text-2xl font-bold hidden sm:block">STRAY PAWS</span>
            </Link>

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

            <div className="flex items-center space-x-5">
              <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden text-gray-700">
                <FiSearch className="h-6 w-6" />
              </button>

              {isLoggedIn ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center text-gray-700 hover:text-purple-600 focus:outline-none"
                  >
                    <FiUser className="h-6 w-6" />
                    <span className="ml-2 font-medium">{userData?.name?.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        See Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:block text-gray-700 hover:text-purple-600">
                  <FiUser className="h-6 w-6" />
                </Link>
              )}

              <div className="relative">
                <Link to="/cart" className="text-gray-700 hover:text-purple-600">
                  <FiShoppingCart className="h-6 w-6" />
                </Link>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700">
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          </div>

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

          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                <Link to="/products" className={`${location.pathname === '/products' ? 'text-purple-600 font-medium' : 'text-gray-600'}`}>
                  All Products
                </Link>
                <Link to="/products/category/food" className={`${location.pathname.includes('/category/food') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}>
                  Food & Treats
                </Link>
                <Link to="/products/category/tech" className={`${location.pathname.includes('/category/tech') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}>
                  Smart Tech
                </Link>
                <Link to="/products/category/toys" className={`${location.pathname.includes('/category/toys') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}>
                  Toys
                </Link>
                <Link to="/products/category/health" className={`${location.pathname.includes('/category/health') ? 'text-purple-600 font-medium' : 'text-gray-600'}`}>
                  Health
                </Link>
                {isLoggedIn && (
                  <>
                    <Link to="/profile" className="text-gray-600">My Account</Link>
                    <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
