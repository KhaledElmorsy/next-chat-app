import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Next Chat',
    default: 'Next Chat',
  },
  description: 'A fullstack chat app made with Next.js',
  creator: 'Khaled Elmorsy',
  keywords: ['Chat', 'Next.js', 'React'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body className={inter.className}>{children}</body>
      </SessionProvider>
    </html>
  );
}
