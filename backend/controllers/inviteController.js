import TeamInvite from "../models/inviteModel.js";
import Team from "../models/teamModel.js";



// Send invitations
export const sendInvitations = async (req, res) => {
  try {
    console.log('Request user:', req.userId);
    console.log('Request body:', req.body);

    const { teamId, volunteerIds } = req.body;
    
    // if (!req.userId || !req.user._id) {
    //   return res.status(401).json({ error: 'User not authenticated' });
    // }

    const fromUserId = req.userId;

    // Verify the user is the creator of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    if (team.creator.toString() !== fromUserId.toString()) {
      return res.status(403).json({ error: 'Only team creator can send invitations' });
    }

    // Create invitations
    const invitations = await Promise.all(
      volunteerIds.map(async (volunteerId) => {
        // Check if invitation already exists
        const existingInvite = await TeamInvite.findOne({
          team: teamId,
          to: volunteerId,
          status: 'pending'
        });
        
        if (existingInvite) {
          return existingInvite;
        }

        return await TeamInvite.create({
          team: teamId,
          from: fromUserId,
          to: volunteerId,
          status: 'pending'
        });
      })
    );

    res.status(201).json(invitations);
  } catch (error) {
    console.error('Error in sendInvitations:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get user's pending invitations
export const getMyInvitations = async (req, res) => {
  try {
    const invites = await TeamInvite.find({ 
      to: req.userId,
      status: 'pending'
    }).populate('team from', 'name email');

    res.json(invites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Respond to invitation
export const respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body;
    const invite = await TeamInvite.findById(req.params.id)
      .populate('team', 'members');

    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    if (invite.to.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to respond to this invitation' });
    }
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already responded' });
    }

    invite.status = status;
    await invite.save();

    if (status === 'accepted') {
      // Add user to team if accepted
      const team = invite.team;
      if (!team.members.includes(invite.to)) {
        team.members.push(invite.to);
        await team.save();
      }
    }

    res.json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};