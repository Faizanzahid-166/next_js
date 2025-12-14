import dbConnect from "@/lib/dbConnection";
import User from "@/models/User.model";

export async function GET(req) {
  await dbConnect();

  try {
    const admin = await User.findOne({ isRoot: true }).lean();

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Root admin not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only safe fields
    const { _id, name, email, role, isRoot } = admin;

    return new Response(JSON.stringify({ admin: { _id, name, email, role, isRoot } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
