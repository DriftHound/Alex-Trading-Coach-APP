'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError(null);

      // Send Google ID token to Manus backend
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/google-login`;
      console.log('Attempting login to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: credentialResponse.credential
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Login failed with status ${response.status}`);
        } else {
          // API returned HTML or other non-JSON (likely 404 or server error)
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText.substring(0, 200));
          throw new Error(`API endpoint not found or returned invalid response. Status: ${response.status}. Please check that the Manus API is configured correctly.`);
        }
      }

      if (!isJson) {
        throw new Error('API returned non-JSON response. Please check API configuration.');
      }

      const data = await response.json();

      // Store JWT token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed');
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-3xl">📈</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Alex Trading Coach</h1>
          <p className="text-gray-400">Professional FX Trading with AI Validation</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        {/* Info */}
        <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg mb-6">
          <p className="text-sm text-gray-300 text-center">
            Sign in with your Google account for secure authentication
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium">6-Step Validation Workflow</p>
              <p className="text-sm text-gray-400">Enforce discipline with mandatory gates</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium">AI-Powered Coaching</p>
              <p className="text-sm text-gray-400">Personalized insights and recommendations</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Strict R:R Enforcement</p>
              <p className="text-sm text-gray-400">Minimum 1:2 ratio required</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            Trade with discipline. Follow the Alex methodology.
          </p>
        </div>
      </div>
    </div>
  );
}
