import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists', email: existingAdmin.email });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@thozhupadam.com',
        password: hashedPassword,
        role: 'admin'
      }
    });

    return NextResponse.json({ message: 'Admin created', email: newAdmin.email });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
