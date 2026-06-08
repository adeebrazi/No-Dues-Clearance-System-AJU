if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
  try {
    if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
      // @ts-ignore
      delete globalThis.localStorage;
    }
  } catch (e) {}
}
if (typeof globalThis !== 'undefined' && 'sessionStorage' in globalThis) {
  try {
    if (!globalThis.sessionStorage || typeof globalThis.sessionStorage.getItem !== 'function') {
      // @ts-ignore
      delete globalThis.sessionStorage;
    }
  } catch (e) {}
}

import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "Student's Dues/No Dues Certificate",
  description: 'Streamline your college clearance process.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
