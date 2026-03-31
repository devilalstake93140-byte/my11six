import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My11Six - Cricket Gaming Platform',
  description: 'Play cricket games and win rewards',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <ChunkErrorHandler />
        <AuthProvider>
          <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0 lg:pt-16">
            <Navbar />
            <main>{children}</main>
            <MobileNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}