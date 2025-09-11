import mongoose, { Schema } from "mongoose";

const teamRequestSchema = new mongoose.Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    message: { type: String },
    skillsShowcase: [{ type: String }],
    experienceLevel: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"] },
    portfolioLinks: [{ type: String }],
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    feedback: { type: String },
  },
  { timestamps: true }
);

const TeamRequest = mongoose.model("TeamRequest", teamRequestSchema);

export default TeamRequest;


