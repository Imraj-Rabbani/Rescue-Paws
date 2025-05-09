import Team from "../models/teamModel.js";
import TeamInvite from "../models/inviteModel.js";
import userModel from "../models/userModel.js";

export const createTeam = async (req, res) => {
  try {
    const { teamName, location } = req.body;

    const team = await Team.create({
      name: teamName,
      area: location,
      creator: req.userId
    });

    res.json(team);
  } catch (err) {
    console.error("Team creation error:", err);
    res.status(500).json({ error: "Failed to create team" });
  }
};

// Send an invite
export const sendTeamInvite = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const { teamId } = req.params;

    const invite = await TeamInvite.create({
      team: teamId,
      from: req.userId,
      to: toUserId,
    });

    res.json(invite);
  } catch (err) {
    res.status(500).json({ error: "Failed to send invite" });
  }
};

// Accept or reject an invite
export const respondToInvite = async (req, res) => {
  try {
    const { status } = req.body;
    const { inviteId } = req.params;

    const invite = await TeamInvite.findById(inviteId);
    if (!invite || invite.to.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    invite.status = status;
    await invite.save();

    if (status === "accepted") {
      await Team.findByIdAndUpdate(invite.team, {
        $addToSet: { members: invite.to },
      });
    }

    res.json(invite);
  } catch (err) {
    res.status(500).json({ error: "Failed to respond to invite" });
  }
};

// Post an activity update
export const postTeamActivity = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { message } = req.body;

    const team = await Team.findById(teamId);
    if (!team || team.creator.toString() !== req.userId) {
      return res.status(403).json({ error: "Only the team creator can post updates" });
    }

    team.activities.push({ message });
    await team.save();

    res.json(team.activities);
  } catch (err) {
    res.status(500).json({ error: "Failed to post update" });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    console.log('Fetching teams created by user:', req.userId);

    // Get teams where the user is the creator
    const teams = await Team.find({ creator: req.userId }).lean();

    if (!teams || teams.length === 0) {
      return res.json([]);
    }

    // Get all unique user IDs from teams (creator + members)
    const userIds = new Set();
    teams.forEach(team => {
      if (team.creator) userIds.add(team.creator.toString());
      if (team.members && Array.isArray(team.members)) {
        team.members.forEach(member => userIds.add(member.toString()));
      }
    });

    // Fetch all users in a single query
    const users = await userModel.find(
      { _id: { $in: Array.from(userIds) } },
      { name: 1, email: 1 }
    ).lean();

    // Create a map for quick lookups
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Manually populate the teams
    const populatedTeams = teams.map(team => {
      // Populate creator
      if (team.creator && userMap[team.creator.toString()]) {
        team.creator = {
          _id: team.creator,
          name: userMap[team.creator.toString()].name
        };
      } else {
        team.creator = { _id: team.creator, name: "Unknown User" };
      }

      // Populate members
      if (team.members && Array.isArray(team.members)) {
        team.members = team.members.map(memberId => {
          const member = userMap[memberId.toString()];
          return member ?
            { _id: memberId, name: member.name, email: member.email } :
            { _id: memberId, name: "Unknown User", email: "unknown@example.com" };
        });
      } else {
        team.members = [];
      }

      return team;
    });

    res.json(populatedTeams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: "Error fetching teams", error: err.message });
  }
};


export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('creator', 'name email')
      .populate('members', 'name email')
      .lean();
    console.log(teams)
    res.status(200).json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Error fetching teams', error: err.message });
  }
};
