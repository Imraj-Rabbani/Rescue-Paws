// backend/controllers/orderController.js
import Order from '../models/Order.js';
import User from '../models/userModel.js';
import Product from '../models/ProductModel.js'; // Import Product model

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

    // Fetch purchase cost for each product
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id);
        if (!product) throw new Error(`Product not found: ${item._id}`);

        return {
          name: item.name,
          imageUrl: item.imageUrl,
          sellingPrice: item.sellingPrice,
          quantity: item.quantity || 1,
          purchaseCostAtOrderTime: product.purchaseCost
        };
      })
    );

    const totalPoints = enrichedItems.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0
    ) + (donation || 0);

    if (user.points < totalPoints) {
      return res.status(400).json({ success: false, message: "Not enough PetPoints." });
    }

    const newOrder = new Order({
      userId,
      products: enrichedItems,
      shippingInfo: {
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

    console.log("Fetched Orders: ", orders);  // Log the fetched orders to check purchaseCost

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
};


// Admin: Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully.' });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status || !['Pending', 'Out for Delivery', 'Delivered'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status provided." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, message: 'Order status updated successfully.', order: updatedOrder });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
