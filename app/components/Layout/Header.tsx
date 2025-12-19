'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [iconPath, setIconPath] = useState('/images/pngicon.png');
  const { darkMode, toggleTheme } = useTheme();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    const img = new Image();
    img.onload = () => {};
    img.onerror = () => {
      setIconPath('./images/pngicon.png');
    };
    img.src = iconPath;
  }, [iconPath]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowConfirmLogout(false);
    router.push('/logIn');
  };

  const linkClasses = (path: string) => 
    `text-white text-base font-medium px-5 py-2.5 rounded-md transition-all duration-300 inline-block ${
      pathname === path 
        ? 'bg-white/30 font-semibold' 
        : 'hover:bg-white/20 hover:-translate-y-0.5'
    }`;

  return (
    <header className="bg-gradient-to-br from-primary to-secondary py-5 shadow-md sticky top-0 z-[100] w-full">
      <nav className="max-w-[1200px] mx-auto px-4">
        <ul className="list-none flex justify-center items-center flex-wrap gap-4 m-0 p-0 w-full">
          <img src={iconPath} alt="Іконка" className="w-[45px] h-[45px] mr-4 rounded-md object-cover" />
          <li className="flex items-center">
            <Link href="/" className={linkClasses('/')}>
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/events" className={linkClasses('/events')}>
              Events
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/booking" className={linkClasses('/booking')}>
              My booking
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/about" className={linkClasses('/about')}>
              About
            </Link>
          </li>
          <li className="flex items-center">
            {currentUser ? (
              <>
                <Link href="/profile" className={linkClasses('/profile')}>
                  Profile
                </Link>
                <span
                  onClick={() => setShowConfirmLogout(true)}
                  className={linkClasses(pathname === '/logIn' ? '/logIn' : '')}>
                  Logout
                </span>
                <span className="mr-2.5 font-medium text-white text-sm">
                  Привіт, {userData?.email || currentUser?.email || 'користувачу'}!
                </span>
              </>
            ) : (
              <Link href="/logIn" className={linkClasses('/logIn')}>
                LogIn
              </Link>
            )}
          </li>
          <li className="ml-auto">
            <button 
              onClick={toggleTheme} 
              className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5">
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>
      </nav>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center shadow-xl max-w-[400px] w-[90%]">
            <p className="text-text-primary dark:text-slate-100 mb-6">Ви дійсно хочете вийти з акаунту?</p>
            <div className="flex gap-4 justify-center mt-6">
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 border-none rounded-md cursor-pointer font-medium transition-all duration-300 bg-error text-white hover:bg-red-600 hover:-translate-y-0.5">
                Так
              </button>
              <button 
                onClick={() => setShowConfirmLogout(false)}
                className="px-6 py-2.5 border-none rounded-md cursor-pointer font-medium transition-all duration-300 bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5">
                Ні
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
