import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

// Token expires in 1 hour
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000;

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jaydeexsf0@gmail.com',
    pass: 'bgoz akel fvqb muqt', // This should be moved to environment variables in production
  },
});

export async function createPasswordResetToken(email: string) {
  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  // Create a new token
  const token = uuidv4();
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return resetToken;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: 'jaydeexsf0@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function validateResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expires < new Date()) {
    return null;
  }

  return resetToken;
}
