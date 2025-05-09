import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [
    {
      name: String,
      imageUrl: String,
      quantity: Number,
      sellingPrice: Number,
      purchaseCostAtOrderTime: Number 
    }
  ],
  userInfo: {
    name: String,
    phone: String,
    address: String,
    promo: String,
    shipping: String
  },
  donation: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

