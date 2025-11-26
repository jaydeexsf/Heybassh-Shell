'use client';

import { useState } from 'react';
import Link from 'next/link';

type MessageVariant = 'success' | 'error' | 'info';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState<MessageVariant>('info');
  const [isLoading, setIsLoading] = useState(false);

  function showMessage(text: string, variant: MessageVariant = 'info') {
    setMessage(text);
    setMessageVariant(variant);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    console.log("[CLIENT] Sending password reset request for:", email);
    
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("[CLIENT] Response received:", data);
      
      if (response.ok && data.success) {
        if (data.emailSent) {
          console.log("[CLIENT] Email sent successfully!");
          showMessage(data.message || 'Password reset email has been sent successfully.', 'success');
        } else {
          console.log("[CLIENT] User not found or email not sent");
          showMessage(data.message || 'If an account exists with this email, a password reset link has been sent. Please check your inbox.', 'info');
        }
      } else {
        console.error("[CLIENT] Email sending failed:", data);
        if (data.errorDetails) {
          console.error("[CLIENT] Detailed email error:", data.errorDetails);
        }
        
        // Special handling for SMTP not configured - show reset URL
        if (data.smtpConfigured === false && data.resetUrl) {
          showMessage(`Email service is not configured. Click here to reset your password: ${data.resetUrl}`, 'error');
          return;
        }
        
        showMessage(data.message || data.error || 'Failed to send reset email. Please try again.', 'error');
      }
    } catch (error) {
      console.error("[CLIENT] Error:", error);
      showMessage('An error occurred while processing your request. Please check your connection and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
        
        {message && (
          <div
            className={`p-4 rounded-md ${
              messageVariant === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : messageVariant === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}
          >
            <p className="text-sm font-medium">
              {message.includes('https://') ? (
                <span>
                  {message.split('https://')[0]}
                  <a
                    href={message.match(/https:\/\/[^\s]+/)?.[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {message.match(/https:\/\/[^\s]+/)?.[0]}
                  </a>
                </span>
              ) : (
                message
              )}
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
          
          <div className="text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
