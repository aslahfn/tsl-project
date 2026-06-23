'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signAdminJWT, verifyAdminJWT } from '@/lib/jwt';
import { saveBase64Image } from '@/lib/upload';
import { recalculatePlayerStats } from '@/lib/playerStats';
import { revalidatePath } from 'next/cache';
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

// Helper for manager auth check
async function checkManagerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('manager_token')?.value;
  if (!token) throw new Error('Not authenticated');
  const payload = await verifyAdminJWT(token);
  if (!payload || payload.role !== 'team_manager') {
    throw new Error('Team Manager privileges required.');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { teamId: true }
  });
  
  if (!user || !user.teamId) {
    throw new Error('No team assigned to this manager.');
  }
  
  return user.teamId;
}

// Unified error handler
async function withErrorHandling<T>(action: () => Promise<T>) {
  try {
    const data = await action();
    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Manager Action Error:', err);
    return { success: false, data: null, error: err.message || 'An unexpected error occurred' };
  }
}

export async function updateManagerTeam(formData: {
  logo: string;
  manager: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  return withErrorHandling(async () => {
    const teamId = await checkManagerAuth();
    
    let logoUrl = undefined;
    if (formData.logo.startsWith('data:image')) {
      const fileName = `team-logo-${Date.now()}.jpg`;
      logoUrl = await saveBase64Image(formData.logo, fileName);
    } else if (formData.logo !== '') {
      logoUrl = formData.logo; // Keep existing
    }
    
    const dataToUpdate: any = {
      manager: formData.manager,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
    };
    
    if (logoUrl) {
      dataToUpdate.logo = logoUrl;
    }
    
    const team = await prisma.team.update({
      where: { id: teamId },
      data: dataToUpdate
    });
    
    revalidatePath('/');
    revalidatePath('/teams');
    revalidatePath(`/teams/${team.slug}`);
    revalidatePath('/manager');
    return team;
  });
}

export async function saveManagerPlayer(formData: {
  id?: string;
  name: string;
  position: string;
  number: number;
  nationality: string;
  age: number;
  photo: string;
}) {
  return withErrorHandling(async () => {
    const teamId = await checkManagerAuth();
    
    let photoUrl = undefined;
    if (formData.photo.startsWith('data:image')) {
      const fileName = `player-photo-${Date.now()}.jpg`;
      photoUrl = await saveBase64Image(formData.photo, fileName);
    } else if (formData.photo !== '') {
      photoUrl = formData.photo;
    }
    
    const data: any = {
      name: formData.name,
      teamId: teamId, // Lock to manager's team
      position: formData.position,
      number: Number(formData.number),
      nationality: formData.nationality,
      age: Number(formData.age),
    };
    
    if (photoUrl) {
      data.photo = photoUrl;
    }
    
    let player;
    if (formData.id) {
      // Ensure the player being updated actually belongs to the manager's team
      const existingPlayer = await prisma.player.findUnique({ where: { id: formData.id } });
      if (!existingPlayer || existingPlayer.teamId !== teamId) {
        throw new Error('Unauthorized to edit this player.');
      }
      
      player = await prisma.player.update({
        where: { id: formData.id },
        data,
      });
    } else {
      if (!data.photo) data.photo = '/players/default.jpg';
      player = await prisma.player.create({
        data,
      });
    }
    
    await recalculatePlayerStats();
    revalidatePath('/players');
    revalidatePath(`/players/${player.id}`);
    revalidatePath(`/teams`);
    revalidatePath('/manager');
    return player;
  });
}

export async function deleteManagerPlayer(id: string) {
  return withErrorHandling(async () => {
    const teamId = await checkManagerAuth();
    
    const existingPlayer = await prisma.player.findUnique({ where: { id } });
    if (!existingPlayer || existingPlayer.teamId !== teamId) {
      throw new Error('Unauthorized to delete this player.');
    }
    
    const player = await prisma.player.delete({
      where: { id },
    });
    
    await recalculatePlayerStats();
    revalidatePath('/players');
    revalidatePath('/manager');
    return player;
  });
}
