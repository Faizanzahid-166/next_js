import { Resend } from "resend";
import VerificationEmail from "../../email/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, name, verifyCode) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.error("Resend API key or FROM email missing");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const result = await resend.emails.send({
      from: `Blitz Ecommerce <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Blitz Ecommerce | Verification Code",
      react: VerificationEmail({ name, otp: verifyCode }),
    });

    console.log(`✅ Verification email sent to ${email}`, result);

    return {
      success: true,
      message: `Verification email sent to ${email}`,
    };
  } catch (err) {
    console.error("Error sending verification email:", err.response?.data || err);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
