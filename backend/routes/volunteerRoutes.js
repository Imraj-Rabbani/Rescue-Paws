import express from 'express'
import { volunteers, getVolunteerProfile, getTopVolunteers, donateToVolunteer } from '../controllers/volunteerController.js'

const volunteerRouter = express.Router()

volunteerRouter.get('/', volunteers)
volunteerRouter.get('/top', getTopVolunteers);
volunteerRouter.get('/:id', getVolunteerProfile);
volunteerRouter.post('/:id/donate' , donateToVolunteer );




export default volunteerRouter;
