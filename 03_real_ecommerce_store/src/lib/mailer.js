// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);
// const fromEmail = process.env.RESEND_FROM_EMAIL || "faizanzahid150@gmail.com";
// const fromName = process.env.RESEND_FROM_NAME || "Blitz Ecommerce Store";

// export async function sendOtpEmail(to, code) {
//   if (!process.env.RESEND_API_KEY) {
//     console.log(`OTP for ${to}: ${code} — ⚠️ Resend API key missing`);
//     return;
//   }

//   const expiresIn = process.env.OTP_EXPIRES_MIN || 10;

//   const html = `
//     <div style="max-width: 480px; margin: auto; font-family: Arial, sans-serif; line-height: 1.6;">
//       <h2 style="color:#222; text-align: center;">Verify Your Email</h2>

//       <p>Hello,</p>
//       <p>Use the OTP code below to verify your email address for <b>Blitz Ecommerce</b>:</p>

//       <div style="
//         background:#f5f5f5;
//         border-radius:8px;
//         padding:20px;
//         text-align:center;
//         margin:24px 0;
//       ">
//         <span style="font-size:32px; letter-spacing:6px; font-weight: bold; color:#333;">
//           ${code}
//         </span>
//       </div>

//       <p>This code expires in <b>${expiresIn} minutes</b>. If you did not request this, you can safely ignore this email.</p>

//       <p style="margin-top: 32px;">Regards,<br><b>Blitz Ecommerce Team</b></p>
//     </div>
//   `;

//   try {
//     const response = await resend.emails.send({
//       from: `${fromName} <${fromEmail}>`,
//       to,
//       subject: "Your Blitz OTP Code",
//       html,
//     });

//     console.log("OTP email sent:", response);
//     return response;

//   } catch (err) {
//     console.error("Failed to send OTP email:", err);
//     throw new Error("Failed to send OTP email");
//   }
// }
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = "onboarding@resend.dev";
const fromName = process.env.RESEND_FROM_NAME || "Blitz Ecommerce Store";

export async function sendOtpEmail(to, code) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`OTP for ${to}: ${code} — ⚠️ Resend API key missing`);
    return;
  }

  const expiresIn = process.env.OTP_EXPIRES_MIN || 10;

  const html = `
    <div style="max-width: 480px; margin: auto; font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color:#222; text-align: center;">Verify Your Email</h2>

      <p>Hello,</p>
      <p>Use the OTP code below to verify your email address for <b>Blitz Ecommerce</b>:</p>

      <div style="
        background:#f5f5f5;
        border-radius:8px;
        padding:20px;
        text-align:center;
        margin:24px 0;
      ">
        <span style="font-size:32px; letter-spacing:6px; font-weight: bold; color:#333;">
          ${code}
        </span>
      </div>

      <p>This code expires in <b>${expiresIn} minutes</b>. If you did not request this, you can safely ignore this email.</p>

      <p style="margin-top: 32px;">Regards,<br><b>Blitz Ecommerce Team</b></p>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject: "Your Blitz OTP Code",
      html,
    });

    console.log("OTP email sent:", response);
    return response;

  } catch (err) {
    console.error("Failed to send OTP email:", err);
    throw new Error("Failed to send OTP email");
  }
}
