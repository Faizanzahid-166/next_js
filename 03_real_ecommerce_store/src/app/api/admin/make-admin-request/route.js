// POST /api/admin/request
import dbConnect from "@/lib/dbConnection";
import AdminRequest from "@/models/AdminRequest.model";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function POST(req) {
  await dbConnect();

  const user = await getUserFromCookies();
  if (!user) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

  // Check if user already has pending request
  const existing = await AdminRequest.findOne({ user: user._id, status: "pending" });
  if (existing) return new Response(JSON.stringify({ message: "Request already pending" }), { status: 400 });

  const request = await AdminRequest.create({ user: user._id });

  return new Response(JSON.stringify({ message: "Request submitted", requestId: request._id }), { status: 200 });
}
