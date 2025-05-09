import express from 'express';
import { placeOrder, getAllOrders, deleteOrder, updateOrderStatus } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js'; // Or your admin authentication middleware

const router = express.Router();

router.post('/place', userAuth, placeOrder);
router.get('/all', userAuth, getAllOrders); 
router.get('/', getAllOrders);
router.delete('/:id', userAuth, deleteOrder);
router.put('/:id', userAuth, updateOrderStatus); 

export default router;