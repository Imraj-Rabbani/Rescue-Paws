// backend/controllers/orderController.js
import Order from '../models/Order.js';
import User from '../models/userModel.js';

// Place an order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, name, phone, address, shipping, promo, donation } = req.body;

    if (!items || !name || !phone || !address || !shipping) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const totalPoints = items.reduce(
      (acc, item) => acc + item.sellingPrice * (item.quantity || 1),
      0
    ) + (donation || 0);

    if (user.points < totalPoints) {
      return res.status(400).json({ success: false, message: "Not enough PetPoints." });
    }

    const newOrder = new Order({
      userId,
      items,
      userInfo: {
        name,
        phone,
        address,
        promo,
        shipping
      },
      donation,
      totalPoints,
      status: 'Pending'
    });

    await newOrder.save();

    // Deduct points from user
    user.points -= totalPoints;
    await user.save();

    res.status(200).json({ success: true, message: "Order placed successfully." });
    
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
};
