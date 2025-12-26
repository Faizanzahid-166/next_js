import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "resend",
    pass: process.env.RESEND_SMTP_PASSWORD, // set this in Vercel
  },
});
