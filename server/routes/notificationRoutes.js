import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { listNotifications, unreadCount, markRead, markAllRead, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", userAuth, listNotifications);
router.get("/count", userAuth, unreadCount);
router.put("/:id/read", userAuth, markRead);
router.put("/read-all", userAuth, markAllRead);
router.delete("/:id", userAuth, deleteNotification);

export default router;


