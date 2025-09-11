import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { listHackathons, getHackathon, createHackathon, updateHackathon, deleteHackathon } from "../controllers/hackathon.controller.js";

const router = express.Router();

router.get("/", listHackathons);
router.get("/:id", getHackathon);
router.post("/", userAuth, createHackathon);
router.put("/:id", userAuth, updateHackathon);
router.delete("/:id", userAuth, deleteHackathon);

export default router;


