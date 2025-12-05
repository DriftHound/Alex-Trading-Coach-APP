import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Call Manus logout endpoint
        const logoutUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/agents', '/api/oauth/logout');

        await fetch(logoutUrl || '', {
            method: 'POST',
            credentials: 'include',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
