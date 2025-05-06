import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      name: String,
      imageUrl: String,
      sellingPrice: Number,
      quantity: Number
    }
  ],
  donation: {
    type: Number,
    default: 0
  },
  totalPoints: Number,
  shippingInfo: {
    name: String,
    phone: String,
    address: String,
    promo: String,
    shipping: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
