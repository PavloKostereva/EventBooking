import './globals.css';
import Layout from './components/Layout/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ReactNode } from 'react';

export const metadata = {
  title: 'EventBooking',
  description: 'Book your favorite events',
  icons: {
    icon: '/images/pngicon.png',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <BookingProvider>
            <ThemeProvider>
              <Layout>{children}</Layout>
            </ThemeProvider>
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

