// /api/user/accept-messages-status/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const userAggregation = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$message" } } },
    ]);

    if (!userAggregation || userAggregation.length === 0) {
      return NextResponse.json(
        { success: false, message: "No messages found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, messages: userAggregation[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Aggregation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error in pipeline" },
      { status: 500 }
    );
  }
}
