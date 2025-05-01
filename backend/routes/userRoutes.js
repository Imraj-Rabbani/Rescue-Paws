import express from 'express'
import { getUserData, setUserData, addPoints } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.get('/profile', userAuth, getUserData)
userRouter.put('/profile', userAuth, setUserData)
userRouter.put('/add-points',userAuth, addPoints)



export default userRouter;