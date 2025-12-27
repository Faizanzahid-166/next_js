// /api/user/send-messges/route.ts
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST() {
  await dbConnect();

  try {
    const users = await UserModel.find({ isAcceptingMessage: true });

    // Generate messages concurrently
    await Promise.all(
      users.map(async (user) => {
        const result = await generateText({
          model: groq("llama-3.1-8b-instant") as any,
          prompt: "Write a short daily life tip or message in 20 words or less.",
        });

        const aiMessage = result.text?.trim() || "Here is your daily message!";

       user.message.push({ content: aiMessage, createdAt: new Date() } as any);
await user.save();

      })
    );

    return NextResponse.json({
      success: true,
      message: "Daily AI messages sent successfully",
    });

  } catch (error) {
    console.error("Daily AI message error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send daily AI messages" },
      { status: 500 }
    );
  }
}
