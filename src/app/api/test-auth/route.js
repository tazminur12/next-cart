import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session found'
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role
      }
    });
    
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({
      authenticated: false,
      error: error.message
    }, { status: 500 });
  }
}
