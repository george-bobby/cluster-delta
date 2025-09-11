import mongoose, { Schema } from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String },
    organizer: { type: String },
    minTeamSize: { type: Number, default: 1 },
    maxTeamSize: { type: Number, default: 4 },
    tags: [{ type: String }],
    categories: [{ type: String }],
    status: { type: String, enum: ["upcoming", "ongoing", "completed", "cancelled"], default: "upcoming" },
    createdBy: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;


