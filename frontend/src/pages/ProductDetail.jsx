import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProductById } from '../services/ProductService';
import { AppContext } from '../context/AppContext';
import '../index.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, productData, isLoggedIn } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const cachedProduct = productData.find(p => String(p.id || p._id) === String(id));
    if (cachedProduct) {
      setProduct(cachedProduct);
    } else {
      getProductById(id).then(data => setProduct(data.product));
    }
  }, [id, productData]);

  useEffect(() => {
    if (!product) return;

    const currentId = String(product.id || product._id);

    const related = productData
      .filter(p => String(p.id || p._id) !== currentId && p.category === product.category)
      .slice(0, 4);

    if (related.length < 4) {
      const extra = productData
        .filter(p => String(p.id || p._id) !== currentId && !related.includes(p))
        .slice(0, 4 - related.length);
      setRelatedProducts([...related, ...extra]);
    } else {
      setRelatedProducts(related);
    }
  }, [product, productData]);

  if (!product) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const discountedPrice = product.discount
    ? (product.sellingPrice * (1 - product.discount / 100)).toFixed(2)
    : product.sellingPrice.toFixed(2);

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      navigate('/checkout', { state: { from: 'buyNow', product: { ...product, quantity } } });
    }
  };

  const maxQty = Math.min(product.stockQuantity || 0, 5);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductNavbar />
      <div className="bg-[AliceBlue] text-black text-center py-2 font-bold">
        ⚡ 20% OFF SMART PRODUCTS - USE CODE: PETTECH20 ⚡
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-98 object-contain rounded-lg shadow" />
          <div className="flex gap-2 mt-4">
            <img
              src={product.imageUrl}
              alt="Thumb 1"
              loading="lazy"
              className="w-20 h-20 object-contain rounded border"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-purple-600 font-semibold text-xl">
                <img src="/petpoints.png" alt="PetPoints" className="w-6 h-6" />
                <span>{discountedPrice}</span>
                <span>PetPoints</span>
              </div>
            </div>

            <div className={`font-medium mb-4 ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stockQuantity > 0
                ? `In Stock (${product.stockQuantity} available)`
                : 'Out of Stock'}
            </div>

            <label htmlFor="quantity" className="block mb-1 font-medium">Quantity</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mb-6 border rounded px-3 py-1 w-24"
              disabled={product.stockQuantity === 0}
            >
              {[...Array(maxQty).keys()].map(n => (
                <option key={n + 1} value={n + 1}>{n + 1}</option>
              ))}
            </select>

            <div className="space-y-3">
              <button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stockQuantity === 0}
              >
                Add to Cart
              </button>
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
              >
                Buy Now
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">Ships from STRAY PAWS | 30-day return policy</p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
