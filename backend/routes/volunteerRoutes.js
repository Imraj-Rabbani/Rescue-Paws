import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { volunteers } from '../controllers/volunteerController.js'

const volunteerRouter = express.Router()

volunteerRouter.get('/', volunteers)




export default volunteerRouter;
