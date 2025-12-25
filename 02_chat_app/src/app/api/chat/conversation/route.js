import mongodb from "@/lib/mongodb";
import Conversation from "@/models/ConversationModel";
import mongoose from "mongoose";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(req) {
  try {
    await mongodb();

    const user = await getUserFromCookies();
    if (!user) return errorResponse("Unauthorized", 401);

    const { participantId } = await req.json();

    if (!participantId) {
      return errorResponse("participantId is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return errorResponse("Invalid participantId", 400);
    }

    if (participantId.toString() === user._id.toString()) {
      return errorResponse("Cannot create conversation with yourself", 400);
    }

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [user._id, participantId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [user._id, participantId],
        isGroup: false,
      });
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name avatar _id");

    return successResponse(
      "Conversation retrieved",
      populatedConversation,
      200
    );
  } catch (err) {
    console.error("Conversation error:", err);
    return errorResponse("Server error", 500);
  }
}
