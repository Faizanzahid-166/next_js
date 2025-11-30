import nodemailer from "nodemailer";

export async function sendOtpEmail(to, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "SMTP"
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Ecommerce Store" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Below is your one-time password:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This code is valid for 5 minutes.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("Failed to send OTP email");
  }
}
