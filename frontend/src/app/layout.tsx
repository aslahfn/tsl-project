import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import GlobalBackground from '@/components/layout/GlobalBackground';
import StadiumParticles from '@/components/ui/StadiumParticles';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: {
    default: 'THOZHUPADAM SUPER LEAGUE | The Ultimate Football Championship',
    template: '%s | THOZHUPADAM SUPER LEAGUE',
  },
  description: 'The official home of THOZHUPADAM SUPER LEAGUE — the ultimate football championship featuring 6 elite clubs competing for glory.',
  keywords: ['TSL 08', 'Super League Season 08', 'Thozhupadam Super League', 'TSL Standings', 'TSL Fixtures', 'Pettikada FC'],
  openGraph: {
    type: 'website',
    siteName: 'THOZHUPADAM SUPER LEAGUE',
    title: 'THOZHUPADAM SUPER LEAGUE | The Ultimate Football Championship',
    description: 'The ultimate football championship — where legends are made.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THOZHUPADAM SUPER LEAGUE',
    description: 'The Ultimate Football Championship',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Outfit:wght@100..900&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider>
          <GlobalBackground />
          <StadiumParticles />
          <LoadingScreen />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
