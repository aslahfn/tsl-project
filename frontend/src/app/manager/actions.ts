'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signAdminJWT } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function registerManagerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const teamId = formData.get('teamId') as string;

  if (!name || !email || !password || !teamId) {
    return { success: false, error: 'All fields are required.' };
  }

  const lowercaseEmail = email.toLowerCase();

  try {
    const existing = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (existing) {
      return { success: false, error: 'Email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email: lowercaseEmail,
        password: hashedPassword,
        role: 'pending_manager',
        teamId,
      },
    });

    return { success: true, message: 'Request sent! Waiting for admin approval.' };
  } catch (err: any) {
    console.error('Manager Registration Error:', err);
    return { success: false, error: 'Failed to register. Please try again.' };
  }
}

export async function loginManagerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (user.role === 'pending_manager') {
      return { success: false, error: 'Your manager request is still pending approval by the admin.' };
    }

    if (user.role !== 'team_manager') {
      return { success: false, error: 'Access denied. You are not an approved team manager.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Generate JWT (we reuse the admin one because it just encodes role/email)
    const token = await signAdminJWT({
      id: user.id,
      email: user.email,
      role: user.role, // role: 'team_manager'
    });

    const cookieStore = await cookies();
    cookieStore.set('manager_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (err: any) {
    console.error('Manager Login Error:', err);
    return { success: false, error: 'Connection error. Please try again.' };
  }
}

export async function logoutManagerAction() {
  const cookieStore = await cookies();
  cookieStore.delete('manager_token');
  redirect('/manager/login');
}
