import express from 'express'
import { getUserData, setUserData, addPoints } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'
import { saveUserCart, getUserCart } from '../controllers/cartController.js';

const userRouter = express.Router()

userRouter.get('/profile', userAuth, getUserData)
userRouter.put('/profile', userAuth, setUserData)
userRouter.put('/add-points',userAuth, addPoints)
userRouter.post('/cart', userAuth, saveUserCart);
userRouter.get('/cart', userAuth, getUserCart);

export default userRouter;