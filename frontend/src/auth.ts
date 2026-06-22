import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import { authConfig } from './auth.config';
import { sendLoginNotification } from '@/lib/mail';

const googleClientId     = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

const providers: any[] = [];

if (
  googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE' &&
  googleClientSecret && googleClientSecret !== 'YOUR_GOOGLE_CLIENT_SECRET_HERE'
) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
} else if (process.env.NODE_ENV !== 'production') {
  console.warn('[TSL Auth] ⚠️ Google OAuth credentials missing. Google Login will be disabled.');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;

        try {
          const emailLower = user.email.toLowerCase();
          let dbUser = await prisma.user.findUnique({
            where: { email: emailLower },
          });

          if (dbUser) {
            if (dbUser.role === 'admin') {
              // Google Login should NOT be available for administrators.
              return '/login?error=AdminOAuthDenied';
            }
          } else {
            // Create user with default 'user' role
            dbUser = await prisma.user.create({
              data: {
                email: emailLower,
                name: user.name || 'Google User',
                password: '', // OAuth users have no password
                role: 'user',
              },
            });
          }

          // Attach database properties to NextAuth user object
          user.id = dbUser.id;
          (user as { role?: string }).role = dbUser.role;
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      if (user.email && user.name) {
        // Run asynchronously so it doesn't block the login flow
        sendLoginNotification(user.email, user.name).catch(console.error);
      }
    }
  }
});

