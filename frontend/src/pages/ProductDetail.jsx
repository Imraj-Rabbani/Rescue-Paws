import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProductById, getAllProducts } from '../services/ProductService';
import { AppContext } from '../context/AppContext';
import '../index.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const current = await getProductById(id);
        setProduct(current);

        const all = await getAllProducts();
        const related = all
          .filter(p => p.id !== id && p.category === current.category)
          .slice(0, 4);

        // If not enough related, show any others
        if (related.length < 4) {
          const fallback = all
            .filter(p => p.id !== id && !related.includes(p))
            .slice(0, 4 - related.length);
          setRelatedProducts([...related, ...fallback]);
        } else {
          setRelatedProducts(related);
        }

      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!product) return <div className="p-8 text-red-500 text-center">Product not found</div>;

  const discountedPrice = product.discount
    ? (product.sellingPrice * (1 - product.discount / 100)).toFixed(2)
    : product.sellingPrice.toFixed(2);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductNavbar />

      <div className="bg-[AliceBlue] text-black text-center py-2 font-bold">
        ⚡ 20% OFF SMART PRODUCTS - USE CODE: PETTECH20 ⚡
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow"
          />
          <div className="flex gap-2 mt-4">
            <img src={product.imageUrl} alt="Thumb 1" className="w-20 h-20 rounded border" />
            <img src={product.imageUrl} alt="Thumb 2" className="w-20 h-20 rounded border" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mb-4">
              {product.discount ? (
                <>
                  <div className="text-2xl font-semibold text-purple-600">BDT {discountedPrice}</div>
                  <div className="text-gray-400 line-through text-sm">BDT {product.sellingPrice}</div>
                </>
              ) : (
                <div className="text-2xl font-semibold">BDT {product.sellingPrice}</div>
              )}
            </div>

            <div className="text-green-600 font-medium mb-4">
              {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            <label htmlFor="quantity" className="block mb-1 font-medium">Quantity</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mb-6 border rounded px-3 py-1 w-24"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <div className="space-y-3">
              <button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                onClick={() => {
                  addToCart(product, quantity);
                  alert(`Added ${quantity} item(s) to cart`);
                }}
              >
                Add to Cart
              </button>
              <button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
                onClick={() => navigate('/paynow')}
              >
                Buy Now
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">Ships from STRAY PAWS | 30-day return policy</p>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
