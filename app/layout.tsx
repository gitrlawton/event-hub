import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ToastNotificationContainer } from '@/components/ui/toast-notification';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Happening - Discover Amazing Tech Events',
  description: 'Connect with the tech community through conferences, workshops, meetups, and networking events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastNotificationContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}