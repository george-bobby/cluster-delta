import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { myTeams, teamsByHackathon, getTeam, createTeam, updateTeam, deleteTeam, requestToJoin, listRequests, handleRequest } from "../controllers/team.controller.js";

const router = express.Router();

router.get("/my-teams", userAuth, myTeams);
router.get("/hackathon/:hackathonId", teamsByHackathon);
router.get("/:id", getTeam);
router.post("/", userAuth, createTeam);
router.put("/:id", userAuth, updateTeam);
router.delete("/:id", userAuth, deleteTeam);
router.post("/:teamId/request", userAuth, requestToJoin);
router.get("/:teamId/requests", userAuth, listRequests);
router.put("/requests/:requestId", userAuth, handleRequest);

export default router;


