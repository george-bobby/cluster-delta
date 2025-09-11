import Notification from "../models/notificationModel.js";

export const listNotifications = async (req, res) => {
  try {
    const userId = req?.body?.user?.userId;
    const data = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unreadCount = async (req, res) => {
  try {
    const userId = req?.body?.user?.userId;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const userId = req?.body?.user?.userId;
    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


