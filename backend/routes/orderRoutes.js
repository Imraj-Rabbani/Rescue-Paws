import express from 'express';
import { placeOrder, getAllOrders } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/place', userAuth, placeOrder);
router.get('/all', userAuth, getAllOrders); 
router.get('/', getAllOrders);
export default router;
