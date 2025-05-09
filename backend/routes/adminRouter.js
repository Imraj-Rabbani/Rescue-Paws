import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import adminAuth from '../middlewares/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/admin/dashboard', userAuth, adminAuth, (req, res) => {
  res.json({ success: true, message: 'Welcome Admin!' });
});

export default adminRouter;
