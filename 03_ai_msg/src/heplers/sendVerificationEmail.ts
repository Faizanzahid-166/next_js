import { Resend } from "resend";
import VerificationEmail from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: `Mystry Message <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email, // ✅ user email
      subject: "Mystry Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: `Verification email sent to ${email}`,
    };
  } catch (err) {
    console.error("Error sending verification email:", err);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
