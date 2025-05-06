// backend/routes/productRoutes.js
import express from 'express';
const router = express.Router();
import Product from '../models/ProductModel.js';


// GET the number of products
router.get('/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count: count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET products with low stock (stockQuantity <= 10)
router.get('/low-stock', async (req, res) => {
    try {
        const lowStockProducts = await Product.find({ stockQuantity: { $lte: 10 } });
        res.json(lowStockProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET the total purchase cost of all products
router.get('/total-purchase-cost', async (req, res) => {
    try {
        const products = await Product.find();
        const totalPurchaseCost = products.reduce((sum, product) => sum + (product.purchaseCost || 0), 0);
        res.json({ totalPurchaseCost });
    } catch (err) {
        console.error('Error fetching total purchase cost:', err);
        res.status(500).json({ message: 'Failed to fetch total purchase cost' });
    }
});

// GET the total purchase value of all products with details
router.get('/total-purchase-value/details', async (req, res) => {
    try {
        const products = await Product.find({}, 'name purchaseCost stockQuantity productAddDate');
        const totalPurchaseValue = products.reduce((sum, product) => sum + ((product.purchaseCost || 0) * (product.stockQuantity || 0)), 0);
        const productDetails = products.map(product => ({
            name: product.name,
            purchaseCost: product.purchaseCost || 0,
            stockQuantity: product.stockQuantity || 0,
            totalValue: ((product.purchaseCost || 0) * (product.stockQuantity || 0)),
            productAddDate: product.productAddDate,
        }));
        res.json({ totalPurchaseValue, productDetails });
    } catch (err) {
        console.error('Error fetching total purchase value details:', err);
        res.status(500).json({ message: 'Failed to fetch total purchase value details' });
    }
});

// GET monthly purchase cost
router.get('/monthly-purchase-cost', async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: 'Please provide year and month.' });
    }

    const y = parseInt(year);
    const m = parseInt(month) - 1; // JavaScript months are 0-indexed
    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59, 999); // Last day of the month

    try {
        const products = await Product.find({
            productAddDate: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        }, 'purchaseCost stockQuantity'); // Include stockQuantity in the fields

        const monthlyPurchaseCost = products.reduce((sum, product) => sum + ((product.purchaseCost || 0) * (product.stockQuantity || 0)), 0);

        res.json({ year: parseInt(year), month: parseInt(month), monthlyPurchaseCost });
    } catch (err) {
        console.error('Error fetching monthly purchase cost:', err);
        res.status(500).json({ message: 'Failed to fetch monthly purchase cost' });
    }
});

// GET detailed monthly purchase cost
router.get('/monthly-purchase-cost/details', async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: 'Please provide year and month.' });
    }

    const y = parseInt(year);
    const m = parseInt(month) - 1;
    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59, 999);

    try {
        const products = await Product.find({
            productAddDate: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        }, 'name purchaseCost stockQuantity productAddDate');

        const totalMonthlyPurchaseValue = products.reduce((sum, product) => sum + ((product.purchaseCost || 0) * (product.stockQuantity || 0)), 0);

        const monthlyPurchaseCostDetails = products.map(product => ({
            name: product.name,
            purchaseCost: product.purchaseCost || 0,
            stockQuantity: product.stockQuantity || 0,
            totalValue: ((product.purchaseCost || 0) * (product.stockQuantity || 0)),
            productAddDate: product.productAddDate,
        }));

        res.json({ year: parseInt(year), month: parseInt(month), totalPurchaseValue: totalMonthlyPurchaseValue, productDetails: monthlyPurchaseCostDetails });
    } catch (err) {
        console.error('Error fetching detailed monthly purchase cost:', err);
        res.status(500).json({ message: 'Failed to fetch detailed monthly purchase cost' });
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
        product.category = req.body.category || product.category;          // Update category
        product.features = req.body.features !== undefined ? req.body.features : product.features; // Update features

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