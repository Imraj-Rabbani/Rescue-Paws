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
    category: { type: String }, // Add the category field
    features: { type: [String] }, // Add the features field as an array of strings
    productAddDate: { type: Date, default: Date.now }, // Add the productAddDate field with a default value of the current date
});

const Product = mongoose.model('Product', productSchema, 'products');

export default Product;