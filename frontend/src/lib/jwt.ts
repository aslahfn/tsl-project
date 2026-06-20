import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'tsl-super-league-jwt-secret-dev';

export async function signAdminJWT(payload: { id: string; email: string; role: string }) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyAdminJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}
