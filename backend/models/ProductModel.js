// backend/models/ProductModel.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  purchaseCost: { type: Number, default: 0 },
  sellingPrice: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  stockQuantity: { type: Number, default: 0 },
  category: { type: String, default: 'uncategorized' }
});

const Product = mongoose.model('Product', productSchema, 'products');

export default Product;
