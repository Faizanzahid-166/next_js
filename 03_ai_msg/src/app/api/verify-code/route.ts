import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json();

    if (!username || !code) {
      return Response.json(
        { success: false, message: "Username and code are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "Account already verified" },
        { status: 400 }
      );
    }

    if (user.verifyCode !== code) {
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }

    if (!user.verifyCodeExpiry || user.verifyCodeExpiry < new Date()) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // ✅ Verify user
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying account:", error);
    return Response.json(
      {
        success: false,
        message: "Verification failed",
      },
      { status: 500 }
    );
  }
}
