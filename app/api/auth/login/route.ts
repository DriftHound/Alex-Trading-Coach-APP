import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { AuthResponse } from '@/types/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Call Manus auth API
        const response = await apiClient.post<AuthResponse>('/auth/login', {
            email,
            password,
        });

        // Create response with httpOnly cookie
        const res = NextResponse.json({
            success: true,
            user: response.user,
        });

        // Set httpOnly cookie with JWT token
        res.cookies.set('auth_token', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return res;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Login failed' },
            { status: 401 }
        );
    }
}
