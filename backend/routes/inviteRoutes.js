import express from 'express';
import { 
  sendInvitations, 
  getMyInvitations, 
  respondToInvitation 
} from '../controllers/inviteController.js';
import userAuth from '../middleware/userAuth.js'

const router = express.Router();

// Send invitations
router.post('/invites/send', userAuth, sendInvitations);

// Get user's pending invitations
router.get('/invites/me', userAuth, getMyInvitations);

// Respond to invitation
router.patch('/invites/:id/respond',userAuth, respondToInvitation);

export default router;