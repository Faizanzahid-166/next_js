import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/heplers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // ✅ Basic validation
    if (!username || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // 🔍 Check username (verified users only)
    const existingUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    // 🔍 Check email
    const existingUserByEmail = await UserModel.findOne({
      email: normalizedEmail,
    });

    // 🔐 Generate OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (existingUserByEmail) {
      // ❌ Already verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      }

      // 🔁 Update unverified user
      existingUserByEmail.password = await bcrypt.hash(password, 10);
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
      await existingUserByEmail.save();
    } else {
      // 🆕 Create new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    // 📧 Send verification email
    const emailResponse = await sendVerificationEmail(
      normalizedEmail,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message || "Email sending failed",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
