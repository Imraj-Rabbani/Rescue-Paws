import Product from '../models/ProductModel.js';
import Order from '../models/Order.js';

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
    const product = await Product.findOne({ id: req.params.id }); // Using 'id', not '_id'
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product }); // 👈 Adjust to match frontend expectation (ProductDetail.jsx uses data.product)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  const { id, name, description, purchaseCost, sellingPrice, imageUrl, stockQuantity, category, discount } = req.body;

  const product = new Product({
    id,
    name,
    description,
    purchaseCost,
    sellingPrice,
    imageUrl,
    stockQuantity: stockQuantity || 0,
    category,
    discount
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
      name: req.body.name ?? product.name,
      description: req.body.description ?? product.description,
      purchaseCost: req.body.purchaseCost ?? product.purchaseCost,
      sellingPrice: req.body.sellingPrice ?? product.sellingPrice,
      imageUrl: req.body.imageUrl ?? product.imageUrl,
      stockQuantity: req.body.stockQuantity ?? product.stockQuantity,
      category: req.body.category ?? product.category,
      discount: req.body.discount ?? product.discount,
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

// @desc    Get recommended products by category
// @route   GET /api/products/recommendations?categories=Cat,Dog&exclude=PET123
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

// @desc    Get most ordered products
// @route   GET /api/products/top-orders
export const getMostOrderedProducts = async (req, res) => {
  try {
    const aggregated = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          imageUrl: { $first: '$items.imageUrl' },
          totalOrders: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 }
    ]);

    const formatted = aggregated.map(item => ({
      name: item._id,
      imageUrl: item.imageUrl,
      orders: item.totalOrders
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching most ordered products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
