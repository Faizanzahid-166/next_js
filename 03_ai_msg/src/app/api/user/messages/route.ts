// src/app/api/user/messages/route.ts
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user._id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    return Response.json({ success: true, messages: user.message }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to fetch messages" }, { status: 500 });
  }
}
