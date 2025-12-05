import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Alex Trading Coach | Professional FX Trading with AI Validation',
    description: 'High-leverage FX trading coach with 6-step validation workflow, TradingView charts, and AI-powered coaching analytics.',
    keywords: ['forex', 'trading', 'FX', 'trading coach', 'technical analysis', 'risk management'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                    {children}
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
