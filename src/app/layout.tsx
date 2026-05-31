import type { Metadata } from 'next';
import { Geist, Geist_Mono, Josefin_Sans, Roboto } from 'next/font/google';

import { AppProviders } from '@/providers/app-providers';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-josefin',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Walkthrough',
  description: 'Code review, made collaborative',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${roboto.className} flex min-h-full flex-col`} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
