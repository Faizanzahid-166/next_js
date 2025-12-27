// src/app/api/mystery-message/route.ts
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function POST() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user._id) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const user = await UserModel.findById(session.user._id);
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (!user.isAcceptingMessage) {
      return NextResponse.json({ success: false, message: "User not accepting messages" }, { status: 403 });
    }

    // Generate 1–3 mystery messages
    const messagesToSend = 1 + Math.floor(Math.random() * 3);
    const sentMessages: string[] = [];

    for (let i = 0; i < messagesToSend; i++) {
      const result = await generateText({
        model: groq("llama-3.1-8b-instant") as any,
        prompt: `Write ONE short anonymous mysterious message.
No emojis, no explanations. Max 25 words.`,
      });

      const aiMessage = result.text?.trim() || "A mysterious message appears...";
user.message.push({ content: aiMessage, createdAt: new Date() } as any);

    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Mystery messages sent",
      sentMessages,
    });

  } catch (error) {
    console.error("Mystery message error:", error);
    return NextResponse.json({ success: false, message: "Failed to send mystery messages" }, { status: 500 });
  }
}
