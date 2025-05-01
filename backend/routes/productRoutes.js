import express from 'express';
const router = express.Router();

import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

// GET all products
router.get('/', getAllProducts);

// GET a single product by ID
router.get('/:id', getProductById);

// POST a new product
router.post('/', createProduct);

// PUT (update) a product by ID
router.put('/:id', updateProduct);

// DELETE a product by ID
router.delete('/:id', deleteProduct);

export default router;
