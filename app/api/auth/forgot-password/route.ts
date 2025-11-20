import { NextResponse } from 'next/server';
import { createPasswordResetToken, sendPasswordResetEmail } from '@/lib/reset-tokens';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the email doesn't exist for security reasons
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    // Create and save the reset token
    const resetToken = await createPasswordResetToken(email);

    // Try to send the email, but don't leak internal errors to the user
    try {
      await sendPasswordResetEmail(email, resetToken.token);
    } catch (err) {
      console.error('Error sending password reset email:', err);
      return NextResponse.json(
        { error: 'We could not send the reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}