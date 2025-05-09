import express from 'express';
import {
  placeOrder,
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';
import Order from '../models/Order.js'; // ✅ Import the Order model

const router = express.Router();

// Place a new order
router.post('/place', userAuth, placeOrder);
router.get('/all', userAuth, getAllOrders); // optionally restrict to admin
router.get('/', getAllOrders);

// ✅ Get order by ID
router.get('/:id', userAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // ✅ use Order (capital O)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// Delete order
router.delete('/:id', userAuth, deleteOrder);

// Update order status
router.put('/:id', userAuth, updateOrderStatus);

export default router;
