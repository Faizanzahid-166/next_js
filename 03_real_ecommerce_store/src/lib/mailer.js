import nodemailer from "nodemailer";


const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const fromName = process.env.SMTP_FROM_NAME || "Your Store";
const fromEmail = process.env.SMTP_FROM_EMAIL || "no-reply@yourstore.com";


if (!host || !user || !pass) {
console.warn("SMTP not fully configured — OTP email won't be sent");
}


export const transporter = nodemailer.createTransport({
host,
port,
auth: { user, pass },
});


export async function sendOtpEmail(to, code) {
if (!host || !user || !pass) {
console.log(`OTP for ${to}: ${code} — SMTP not configured`);
return;
}


const html = `
<div>
<p>Your verification code is:</p>
<h2>${code}</h2>
<p>This code will expire in ${process.env.OTP_EXPIRES_MIN || 10} minutes.</p>
</div>
`;


await transporter.sendMail({
from: `${fromName} <${fromEmail}>`,
to,
subject: "Your verification code",
html,
});
}