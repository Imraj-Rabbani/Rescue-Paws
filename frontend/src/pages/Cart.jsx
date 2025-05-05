import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';

const Cart = () => {
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart
  } = useContext(AppContext);

  const [donation, setDonation] = useState(0);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );
  const total = subtotal + donation;

  const handleProceed = () => {
    navigate('/checkout', { state: { from: 'cart', donation } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ProductNavbar />

      <div className="container mx-auto py-10 flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

          {cart.length === 0 ? (
            <div className="text-gray-600 text-center py-20">
              <p>Your cart is empty.</p>
              <Link to="/products" className="text-purple-600 hover:underline">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-green-600 mt-1">In Stock</p>

                      {/* PetPoints Display */}
                      <div className="flex items-center gap-2 text-purple-700 font-semibold mt-1">
                        <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
                        <span>{(item.sellingPrice * item.quantity).toFixed(2)}</span>
                        <span>PetPoints</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <label>Qty:</label>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartItemQuantity(item.id, parseInt(e.target.value))
                        }
                        className="border px-2 py-1 rounded"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="text-xl font-semibold mb-4">
              Subtotal ({cart.length} item{cart.length !== 1 && 's'})
            </h3>

            {/* PetPoints Subtotal */}
            <p className="text-md mb-2 text-gray-700 flex items-center gap-2">
              Subtotal:
              <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
              <strong>{subtotal.toFixed(2)} PetPoints</strong>
            </p>

            {/* Donation */}
            <div className="mt-4">
              <label htmlFor="donation" className="block text-sm font-medium mb-1">
                Optional Donation to Animal Rescues:
              </label>
              <select
                id="donation"
                value={donation}
                onChange={(e) => setDonation(parseFloat(e.target.value))}
                className="w-full border rounded px-3 py-2"
              >
                <option value={0}>None</option>
                <option value={10}>10 PetPoints</option>
                <option value={20}>20 PetPoints</option>
                <option value={50}>50 PetPoints</option>
              </select>
            </div>

            <hr className="my-4" />

            {/* Total in PetPoints */}
            <div className="flex justify-between font-bold text-lg mb-2 items-center">
              <span>Total:</span>
              <div className="flex items-center gap-2">
                <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
                <span>{total.toFixed(2)} PetPoints</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
