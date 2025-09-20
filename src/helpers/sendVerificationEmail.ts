import nodemailer from "nodemailer";
import { apiResponse } from "./apiResponse";
import VerificationEmail from "../Email/emailVerification";

export async function sendVerificationEmail(
  userName: string,
  email: string,
  otp: string
): Promise<apiResponse> {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use "smtp" if using Brevo, Mailjet, etc.
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // app password (not normal Gmail password)
      },
    });

    // Render your React email component to HTML
    const html = VerificationEmail( userName, otp);

    // Email options
    const mailOptions = {
      from: `"Mystery Message" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Mystery Message Verification Code",
      html, // use the rendered React email template
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error while sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
