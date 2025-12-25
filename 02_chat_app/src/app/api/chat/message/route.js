import mongodb from "@/lib/mongodb";
import Message from "@/models/MessageModel";
import Conversation from "@/models/ConversationModel";
import { getUserFromCookies } from "@/lib/getUserFromRequest";
import { errorResponse, successResponse } from "@/lib/response";

// ✅ SEND MESSAGE
export async function POST(req) {
  try {
    await mongodb();

    const user = await getUserFromCookies();
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { conversationId, participantId, text } = body;

    if (!text) {
      return errorResponse("text is required", 400);
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return errorResponse("Conversation not found", 404);
      }
    } else if (participantId) {
      conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [user._id, participantId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [user._id, participantId],
        });
      }
    } else {
      return errorResponse("conversationId or participantId is required", 400);
    }

    // ✅ AUTH CHECK (FIXED)
    if (!conversation.participants.some(id => id.equals(user._id))) {
      return errorResponse("Forbidden", 403);
    }

    const message = await Message.create({
  conversationId: conversation._id,
  sender: user._id,
  text,
  seenBy: [user._id],
});

conversation.lastMessage = message._id;
await conversation.save();

    conversation.lastMessage = message._id;
    await conversation.save();

    return successResponse("Message sent", message, 201);
  } catch (err) {
    console.error("POST message error:", err);
    return errorResponse("Server error", 500);
  }
}

// ✅ GET MESSAGES
export async function GET(req) {
  try {
    await mongodb();

    const user = await getUserFromCookies();
    if (!user) return errorResponse("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return errorResponse("conversationId is required", 400);
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return errorResponse("Conversation not found", 404);

    if (!conversation.participants.includes(user._id)) {
      return errorResponse("Forbidden", 403);
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email avatar");

    return successResponse("Messages retrieved", messages, 200);
  } catch (err) {
    console.error("GET message error:", err);
    return errorResponse("Server error", 500);
  }
}
