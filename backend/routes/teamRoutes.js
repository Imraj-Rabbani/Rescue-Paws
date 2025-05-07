import express from "express";
import {createTeam, sendTeamInvite, respondToInvite, postTeamActivity} from "../controllers/teamController.js";
import userAuth from "../middleware/userAuth.js";

const teamRouter = express.Router();

teamRouter.post("/", userAuth, createTeam);
teamRouter.post("/:teamId/invite", userAuth, sendTeamInvite);
teamRouter.post("/invite/:inviteId/respond", userAuth, respondToInvite);
teamRouter.post("/:teamId/activity", userAuth, postTeamActivity);

export default teamRouter;
