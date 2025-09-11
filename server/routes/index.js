import express from "express";
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import postRoute from "./postRoutes.js";
import hackathonRoute from "./hackathonRoutes.js";
import teamRoute from "./teamRoutes.js";
import notificationRoute from "./notificationRoutes.js";

const router = express.Router();

router.use(`/auth`, authRoute); //auth/register
router.use(`/users`, userRoute);
router.use(`/posts`, postRoute);
router.use(`/hackathons`, hackathonRoute);
router.use(`/teams`, teamRoute);
router.use(`/notifications`, notificationRoute);

export default router;
