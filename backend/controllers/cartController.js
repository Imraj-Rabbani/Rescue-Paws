import Cart from '../models/CartModel.js';

export const saveUserCart = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  try {
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      existingCart.items = items;
      await existingCart.save();
    } else {
      await Cart.create({ userId, items });
    }
    res.status(200).json({ message: 'Cart saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart?.items || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
