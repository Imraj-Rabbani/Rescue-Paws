import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { volunteers, getVolunteerProfile, getTopVolunteers } from '../controllers/volunteerController.js'

const volunteerRouter = express.Router()

volunteerRouter.get('/', volunteers)
volunteerRouter.get('/top', getTopVolunteers);
volunteerRouter.get('/:id', getVolunteerProfile);

export default volunteerRouter;
