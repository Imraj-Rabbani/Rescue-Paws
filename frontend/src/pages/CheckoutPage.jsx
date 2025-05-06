import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductNavbar from '../components/ProductNavbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, userData, backendUrl, setCart } = useContext(AppContext);
  const { from, product, donation = 0 } = location.state || {};

  const [includeCart, setIncludeCart] = useState(false);
  const [showCartBox, setShowCartBox] = useState(from === 'buyNow' && cart.length > 0);
  const [donationInput, setDonationInput] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    promo: '',
    shipping: 'standard',
  });

  const products =
    from === 'cart'
      ? cart
      : includeCart && cart.length > 0
      ? [product, ...cart]
      : [product];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const effectiveDonation = from === 'buyNow' ? donationInput : donation;

  const totalPoints =
    products.reduce(
      (sum, item) => sum + item.sellingPrice * (item.quantity || 1),
      0
    ) + effectiveDonation;

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.dismiss();
      toast.error('Please fill out all required fields.');
      return;
    }

    if (!userData || userData.points < totalPoints) {
      toast.dismiss();
      toast.error('Not enough PetPoints to complete this order.');
      return;
    }

    setPlacingOrder(true);
    try {
      const response = await axios.post(`${backendUrl}/api/orders/place`, {
        items: products,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        shipping: formData.shipping,
        promo: formData.promo,
        donation: effectiveDonation,
      }, { withCredentials: true });
    
      toast.dismiss();
    
      if ((response.status === 200 || response.status === 201) && response.data.success) {
        toast.success('✅ Order placed successfully!');
        setCart([]);
        setTimeout(() => navigate('/products'), 2000);
      } else {
        toast.error(response.data?.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      toast.dismiss();
      console.error("Caught error:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong while placing the order.");
      }
    }
  };

  return (
    <div className="bg-blue-50 text-gray-800 min-h-screen">
      <ProductNavbar />
      <div className="max-w-7xl mx-auto py-10 px-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <h2 className="text-3xl font-bold text-blue-700 text-center">
            Confirm Your Order 🧾
          </h2>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">🛍️ Your Items</h3>
            {products.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 border-b border-blue-200 py-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <div className="flex items-center gap-2 text-purple-700 font-medium">
                    <span>{item.quantity || 1} x</span>
                    <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
                    <span>{item.sellingPrice.toFixed(2)}</span>
                    <span>PetPoints</span>
                  </div>
                </div>
              </div>
            ))}

            {effectiveDonation > 0 && (
              <div className="text-right text-sm text-gray-600 mt-2 italic">
                Includes{' '}
                <span className="font-semibold text-purple-700">
                  {effectiveDonation} PetPoints
                </span>{' '}
                donation 🐾
              </div>
            )}
            <div className="text-right text-lg font-semibold text-purple-700 mt-4 flex items-center justify-end gap-2">
              <img src="/petpoints.png" alt="PetPoints" className="w-5 h-5" />
              <span>{totalPoints.toFixed(2)} PetPoints</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md space-y-5">
            <h3 className="text-lg font-semibold mb-3">
              📋 Shipping Information
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-blue-100 border border-blue-300 rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-blue-100 border border-blue-300 rounded"
            />
            <textarea
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 bg-blue-100 border border-blue-300 rounded"
            />
            <input
              type="text"
              name="promo"
              placeholder="Promo Code (optional)"
              value={formData.promo}
              onChange={handleChange}
              className="w-full p-3 bg-blue-100 border border-blue-300 rounded"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Shipping Method</label>
                <select
                  name="shipping"
                  value={formData.shipping}
                  onChange={handleChange}
                  className="w-full p-3 bg-blue-100 border border-blue-300 rounded"
                >
                  <option value="standard">Standard Shipping</option>
                  <option value="express">Express Shipping</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Payment Method</label>
                <div className="w-full p-3 bg-blue-100 border border-blue-300 rounded text-blue-800 font-semibold flex items-center gap-2">
                  <img src="/petpoints.png" alt="PetPoints" className="w-6 h-6" />
                  PetPoints Only
                </div>
              </div>
            </div>

            {from === 'buyNow' && (
              <div>
                <label className="block mb-1 font-medium">Optional Donation 🐾</label>
                <select
                  value={donationInput}
                  onChange={(e) => setDonationInput(parseFloat(e.target.value))}
                  className="w-full p-3 bg-blue-100 border border-blue-300 rounded"
                >
                  <option value={0}>None</option>
                  <option value={10}>10 PetPoints</option>
                  <option value={20}>20 PetPoints</option>
                  <option value={50}>50 PetPoints</option>
                </select>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
            >
              🚀 {placingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>

        {showCartBox && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              🛒 Items in Your Cart
            </h3>
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-gray-200 py-3"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div className="flex-1 ml-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-1 text-purple-700 font-medium">
                  <img src="/petpoints.png" alt="PetPoints" className="w-4 h-4" />
                  <span>{item.sellingPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => {
                  setIncludeCart(true);
                  setShowCartBox(false);
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                ✅ Yes, Add
              </button>
              <button
                onClick={() => setShowCartBox(false)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
              >
                ❌ No, Skip
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
