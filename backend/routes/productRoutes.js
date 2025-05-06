import express from 'express';
const router = express.Router();

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRecommendedProducts
} from '../controllers/productController.js';

import Product from '../models/ProductModel.js';

// GET the number of products
router.get('/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define specific routes before dynamic ones
router.get('/recommendations', getRecommendedProducts);

// GET products with low stock
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stockQuantity: { $lte: 10 } });
    res.json(lowStockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET total purchase cost
router.get('/total-purchase-cost', async (req, res) => {
  try {
    const products = await Product.find();
    const totalPurchaseCost = products.reduce((sum, p) => sum + (p.purchaseCost || 0), 0);
    res.json({ totalPurchaseCost });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch total purchase cost' });
  }
});

// GET total purchase value with details
router.get('/total-purchase-value/details', async (req, res) => {
  try {
    const products = await Product.find({}, 'name purchaseCost stockQuantity productAddDate');
    const totalPurchaseValue = products.reduce(
      (sum, p) => sum + ((p.purchaseCost || 0) * (p.stockQuantity || 0)),
      0
    );
    const productDetails = products.map(p => ({
      name: p.name,
      purchaseCost: p.purchaseCost || 0,
      stockQuantity: p.stockQuantity || 0,
      totalValue: (p.purchaseCost || 0) * (p.stockQuantity || 0),
      productAddDate: p.productAddDate,
    }));
    res.json({ totalPurchaseValue, productDetails });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch total purchase value details' });
  }
});

// GET monthly purchase cost
router.get('/monthly-purchase-cost', async (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) return res.status(400).json({ message: 'Please provide year and month.' });

  const y = parseInt(year);
  const m = parseInt(month) - 1;
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

  try {
    const products = await Product.find({ productAddDate: { $gte: start, $lte: end } }, 'purchaseCost stockQuantity');
    const monthlyPurchaseCost = products.reduce((sum, p) => sum + ((p.purchaseCost || 0) * (p.stockQuantity || 0)), 0);
    res.json({ year: y, month: m + 1, monthlyPurchaseCost });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch monthly purchase cost' });
  }
});

// GET detailed monthly purchase cost
router.get('/monthly-purchase-cost/details', async (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) return res.status(400).json({ message: 'Please provide year and month.' });

  const y = parseInt(year);
  const m = parseInt(month) - 1;
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

  try {
    const products = await Product.find({ productAddDate: { $gte: start, $lte: end } }, 'name purchaseCost stockQuantity productAddDate');
    const total = products.reduce((sum, p) => sum + ((p.purchaseCost || 0) * (p.stockQuantity || 0)), 0);
    const productDetails = products.map(p => ({
      name: p.name,
      purchaseCost: p.purchaseCost || 0,
      stockQuantity: p.stockQuantity || 0,
      totalValue: (p.purchaseCost || 0) * (p.stockQuantity || 0),
      productAddDate: p.productAddDate,
    }));
    res.json({ year: y, month: m + 1, totalPurchaseValue: total, productDetails });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch detailed monthly purchase cost' });
  }
});

// GET all products
router.get('/', getAllProducts);

// GET a single product by ID
router.get('/:id', getProductById);

// POST a new product
router.post('/', async (req, res) => {
  const product = new Product({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    purchaseCost: req.body.purchaseCost,
    sellingPrice: req.body.sellingPrice,
    imageUrl: req.body.imageUrl,
    stockQuantity: req.body.stockQuantity || 0,
    category: req.body.category,
    features: req.body.features || [],
    productAddDate: req.body.productAddDate,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product by ID
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.purchaseCost = req.body.purchaseCost || product.purchaseCost;
    product.sellingPrice = req.body.sellingPrice || product.sellingPrice;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.stockQuantity = req.body.stockQuantity !== undefined ? req.body.stockQuantity : product.stockQuantity;
    product.category = req.body.category || product.category;
    product.features = req.body.features !== undefined ? req.body.features : product.features;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product by ID
router.delete('/:id', deleteProduct);

export default router;
