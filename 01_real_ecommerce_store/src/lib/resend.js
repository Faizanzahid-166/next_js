import { Resend } from "resend";
import VerificationEmail from "../../email/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    await resend.emails.send({
      from: `Blitz Ecommerce <${process.env.RESEND_FROM_EMAIL}>`, // ✅ plain text
      to: email,
      subject: "Blitz Ecommerce | Verification Code", // ✅ plain text
      react: VerificationEmail({ username, otp: verifyCode }), // ✅ React email content
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
