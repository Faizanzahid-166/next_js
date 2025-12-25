// src/models/ConversationModel.js
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  isGroup: { type: Boolean, default: false },
  name: { type: String }, // group name
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
}, { timestamps: true });

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
