import mongoose, { Schema } from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    hackathonId: { type: Schema.Types.ObjectId, ref: "Hackathon", required: true },
    name: { type: String, required: true },
    description: { type: String },
    requiredSkills: [{ type: String }],
    technologies: [{ type: String }],
    projectIdea: { type: String },
    maxSize: { type: Number, default: 4 },
    isOpen: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Users" },
        role: { type: String, default: "member" },
      },
    ],
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;


