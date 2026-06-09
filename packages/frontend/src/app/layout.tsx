import type { Metadata } from 'next';
import { Sora, Fraunces } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces'
});

export const metadata: Metadata = {
  title: 'Admire Platform',
  description: 'Adult content platform frontend'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  );
}
