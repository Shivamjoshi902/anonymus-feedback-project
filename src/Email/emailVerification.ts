export default function VerificationEmail(userName: string, otp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2>Hello ${userName},</h2>
      <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
      <h3 style="background: #f4f4f4; padding: 8px 12px; display: inline-block;">${otp}</h3>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
  `;
}
