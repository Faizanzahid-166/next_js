// src/models/AdminRequest.model.js
import mongoose from "mongoose";

const AdminRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.models.AdminRequest || mongoose.model("AdminRequest", AdminRequestSchema);
