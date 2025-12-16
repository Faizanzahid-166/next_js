import dbConnect from "@/lib/dbConnection";
import AdminRequest from "@/models/AdminRequest.model";
import User from "@/models/User.model";
import { getUserFromCookies } from "@/lib/getUserFromRequest";

export async function POST(req) {
  await dbConnect();

  const rootUser = await getUserFromCookies();
  if (!rootUser || !rootUser.isRoot) {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }

  const { requestId, accept } = await req.json();

  const request = await AdminRequest.findById(requestId).populate("user");
  if (!request) return new Response(JSON.stringify({ message: "Request not found" }), { status: 404 });

  if (accept) {
    // Promote the user to admin
    const user = request.user;
    user.role = "admin";
    await user.save(); // <-- important!
    request.status = "accepted";
  } else {
    request.status = "rejected";
  }

  await request.save();

  return new Response(
    JSON.stringify({ message: `Request ${request.status}`, user: request.user }),
    { status: 200 }
  );
}
