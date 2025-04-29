import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ProductNavbar from '../components/ProductNavbar';

const cartItems = [
  {
    id: 1,
    name: 'Quantum Pet Feeder',
    image: '/QuantumFeeder.jpg',
    price: 129.99,
    quantity: 1
  },
  {
    id: 2,
    name: 'Smart Collar X9',
    image: '/SmartColler.jpg',
    price: 199.99,
    quantity: 2
  }
];

const Cart = () => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProductNavbar />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty.</p>
            <Link to="/products" className="text-purple-600 font-semibold hover:underline">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center bg-white rounded-xl shadow p-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                  <div className="flex-grow">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span>Qty:</span>
                      <input
                        type="number"
                        value={item.quantity}
                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="text-right font-bold text-gray-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm text-gray-500">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
