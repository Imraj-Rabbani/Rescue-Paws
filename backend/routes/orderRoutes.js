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



// Delete order
router.delete('/:id', userAuth, deleteOrder);

// Update order status
router.put('/:id', userAuth, updateOrderStatus);

export default router;
