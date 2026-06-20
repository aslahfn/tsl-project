import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const GET = auth((req) => {
  if (!req.auth) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: req.auth.user }, { status: 200 });
});
