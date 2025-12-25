// src/models/MessageModel.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String },
  attachments: [{ type: String }], // images, files
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
