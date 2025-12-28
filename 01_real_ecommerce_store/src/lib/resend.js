import { Resend } from "resend";
import VerificationEmail from "../../email/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, name, verifyCode) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_APP_DOMAIN) {
    console.error("Resend API key, FROM email, or app domain missing");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/verify-otp?email=${encodeURIComponent(email)}`;

    const result = await resend.emails.send({
      from: `Blitz Ecommerce <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Blitz Ecommerce | Verification Code",
      react: VerificationEmail({
        name,
        otp: verifyCode,
        verifyUrl, // pass link to template
      }),
    });

    console.log(`✅ Verification email sent to ${email}`, result);

    return { success: true, message: `Verification email sent to ${email}` };
  } catch (err) {
    console.error("Error sending verification email:", err.response?.data || err);
    return { success: false, message: "Failed to send verification email" };
  }
}
