// backend/routes/productRoutes.js
import express from 'express';
const router = express.Router();
import Product from '../models/ProductModel.js'; // Updated import

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        purchaseCost: req.body.purchaseCost,
        sellingPrice: req.body.sellingPrice,
        imageUrl: req.body.imageUrl,
        stockQuantity: req.body.stockQuantity || 0, // Ensure stockQuantity is included on creation
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) a product by ID
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.purchaseCost = req.body.purchaseCost || product.purchaseCost;
        product.sellingPrice = req.body.sellingPrice || product.sellingPrice;
        product.imageUrl = req.body.imageUrl || product.imageUrl;
        product.stockQuantity = req.body.stockQuantity !== undefined ? req.body.stockQuantity : product.stockQuantity;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;