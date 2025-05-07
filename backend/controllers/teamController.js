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
