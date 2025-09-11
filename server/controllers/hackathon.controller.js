import Hackathon from "../models/hackathonModel.js";
import userAuth from "../middleware/authMiddleware.js";

export const listHackathons = async (req, res) => {
  try {
    const data = await Hackathon.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Hackathon.findById(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHackathon = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req?.body?.user?.userId };
    const created = await Hackathon.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Hackathon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Hackathon.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


