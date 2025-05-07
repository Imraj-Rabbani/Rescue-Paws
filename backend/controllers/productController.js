import Product from '../models/ProductModel.js'; 

// @desc    Get all products
// @route   GET /api/products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
    const { id, name, description, purchaseCost, sellingPrice, imageUrl, stockQuantity } = req.body;
    const product = new Product({
        id,
        name,
        description,
        purchaseCost,
        sellingPrice,
        imageUrl,
        stockQuantity: stockQuantity || 0,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        Object.assign(product, {
            name: req.body.name || product.name,
            description: req.body.description || product.description,
            purchaseCost: req.body.purchaseCost ?? product.purchaseCost,
            sellingPrice: req.body.sellingPrice ?? product.sellingPrice,
            imageUrl: req.body.imageUrl || product.imageUrl,
            stockQuantity: req.body.stockQuantity ?? product.stockQuantity,
        });

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getRecommendedProducts = async (req, res) => {
    const { categories = '', exclude = '' } = req.query;
  
    try {
      const categoryArray = categories.split(',').filter(Boolean);
      const excludeArray = exclude.split(',').filter(Boolean);
  
      const recommended = await Product.find({
        category: { $in: categoryArray },
        id: { $nin: excludeArray }
      }).limit(6);
  
      res.json(recommended);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
    }
  };
  