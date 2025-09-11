import Team from "../models/teamModel.js";
import TeamRequest from "../models/teamRequestModel.js";
import Notification from "../models/notificationModel.js";
import Users from "../models/userModel.js";
import { sendGenericEmail } from "../utils/sendEmail.js";

export const myTeams = async (req, res) => {
  try {
    const userId = req?.body?.user?.userId;
    const teams = await Team.find({ $or: [{ createdBy: userId }, { "members.userId": userId }] })
      .populate("hackathonId")
      .populate("members.userId", "firstName lastName profileUrl");
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const teamsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const teams = await Team.find({ hackathonId }).populate("members.userId", "firstName lastName profileUrl");
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate("members.userId", "firstName lastName profileUrl");
    if (!team) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const userId = req?.body?.user?.userId;
    const payload = { ...req.body, createdBy: userId, members: [{ userId, role: "owner" }] };
    const created = await Team.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Team.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    await Team.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestToJoin = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req?.body?.user?.userId;
    const { message, skillsShowcase, experienceLevel, portfolioLinks } = req.body;
    const request = await TeamRequest.create({
      teamId,
      requesterId: userId,
      message,
      skillsShowcase,
      experienceLevel,
      portfolioLinks,
    });

    const team = await Team.findById(teamId);
    if (team) {
      await Notification.create({
        userId: team.createdBy,
        type: "team_request",
        title: "New team join request",
        message: "Someone requested to join your team",
        metadata: { teamId: teamId, requestId: request._id },
        priority: "normal",
      });
      const owner = await Users.findById(team.createdBy);
      if (owner?.email) {
        sendGenericEmail({
          to: owner.email,
          subject: "New team join request",
          html: `<p>You have a new request to join team <b>${team.name}</b>.</p>`,
        });
      }
    }

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listRequests = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (String(team.createdBy) !== String(req?.body?.user?.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const data = await TeamRequest.find({ teamId }).populate("requesterId", "firstName lastName profileUrl skills");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, feedback } = req.body;
    const request = await TeamRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const team = await Team.findById(request.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    if (String(team.createdBy) !== String(req?.body?.user?.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    request.status = status;
    request.feedback = feedback;
    await request.save();

    if (status === "accepted") {
      const alreadyMember = team.members.some((m) => String(m.userId) === String(request.requesterId));
      if (!alreadyMember && team.members.length < team.maxSize) {
        team.members.push({ userId: request.requesterId, role: "member" });
        await team.save();
      }
    }

    await Notification.create({
      userId: request.requesterId,
      type: "team_request_update",
      title: status === "accepted" ? "Request accepted" : "Request rejected",
      message: feedback || "Your request has been updated",
      metadata: { teamId: request.teamId, requestId: request._id, status },
      priority: "normal",
    });

    const requester = await Users.findById(request.requesterId);
    if (requester?.email) {
      sendGenericEmail({
        to: requester.email,
        subject: `Your request was ${status}`,
        html: `<p>Your request for team <b>${team.name}</b> was <b>${status}</b>. ${feedback || ""}</p>`,
      });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


