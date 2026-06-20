import ClientLoginFormWrapper from './ClientLoginForm';

export const dynamic = 'force-dynamic';

export default function UserLoginPage() {
  const isGoogleEnabled = !!(
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' &&
    process.env.AUTH_GOOGLE_SECRET &&
    process.env.AUTH_GOOGLE_SECRET !== 'YOUR_GOOGLE_CLIENT_SECRET_HERE'
  );

  return <ClientLoginFormWrapper isGoogleEnabled={isGoogleEnabled} />;
}
