'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // Check if authentication was successful by calling a protected endpoint
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
                    {
                        credentials: 'include', // Include cookies
                    }
                );

                if (response.ok) {
                    setStatus('success');

                    // Get return URL or default to dashboard
                    const returnUrl = localStorage.getItem('oauth_return_url') || '/dashboard';
                    localStorage.removeItem('oauth_return_url');

                    // Redirect after short delay
                    setTimeout(() => {
                        router.push(returnUrl);
                    }, 1000);
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (err) {
                setStatus('error');
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        };

        verifyAuth();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="card max-w-md w-full text-center">
                {status === 'verifying' && (
                    <>
                        <div className="animate-spin text-6xl mb-4">⏳</div>
                        <h2 className="text-2xl font-semibold mb-2">Verifying Authentication</h2>
                        <p className="text-gray-400">Please wait...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-semibold mb-2 text-success">Authentication Successful!</h2>
                        <p className="text-gray-400">Redirecting to dashboard...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <h2 className="text-2xl font-semibold mb-2 text-danger">Authentication Failed</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="btn-primary"
                        >
                            Return to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
