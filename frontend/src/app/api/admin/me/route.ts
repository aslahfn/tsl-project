import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminJWT } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAdminJWT(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
