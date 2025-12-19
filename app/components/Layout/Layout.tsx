'use client';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-[1200px] mx-auto my-8 px-8 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
