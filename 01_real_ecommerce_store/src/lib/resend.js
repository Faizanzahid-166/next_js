import { Resend } from "resend";
import VerificationEmail from "../../email/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

const normalizeBaseUrl = (value) => (value || "").trim().replace(/\/+$/, "");

const appDomain = normalizeBaseUrl(
  process.env.APP_DOMAIN ||
    process.env.NEXT_PUBLIC_APP_DOMAIN ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
);

const senderName = process.env.RESEND_FROM_NAME || "Blitz Store";
const senderEmail = process.env.RESEND_FROM_EMAIL || "noreply@blitz-box.site";

export async function sendVerificationEmail(email, name, verifyCode) {
  if (!process.env.RESEND_API_KEY || !senderEmail || !appDomain) {
    console.error("Resend API key, FROM email, or app domain missing");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const verifyUrl = new URL(`/verify-otp/${encodeURIComponent(email)}`, appDomain).toString();
    const plainText = `Hello ${name || "there"},\n\nYour Blitz Store verification code is: ${verifyCode}\n\nVerify your email here: ${verifyUrl}\n\nThis code expires in 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.`;

    const result = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: email,
      replyTo: senderEmail,
      subject: "Your Blitz Store verification code",
      text: plainText,
      react: VerificationEmail({
        name: name || "there",
        otp: verifyCode,
        verifyUrl,
      }),
    });

    console.log(`✅ Verification email sent to ${email}`, result);

    return { success: true, message: `Verification email sent to ${email}` };
  } catch (err) {
    console.error("Error sending verification email:", err.response?.data || err);
    return { success: false, message: "Failed to send verification email" };
  }
}
