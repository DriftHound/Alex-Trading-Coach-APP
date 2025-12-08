import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Confluence Checklist Coach | Pre-Trade Checklist for Rule-Based Traders',
    description: 'Structured pre-trade checklist for confluence-based, set-and-forget traders. Follow your own rules before placing a trade. Educational use only.',
    keywords: ['trading checklist', 'pre-trade planning', 'confluence trading', 'set and forget', 'risk management', 'trading discipline'],
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
