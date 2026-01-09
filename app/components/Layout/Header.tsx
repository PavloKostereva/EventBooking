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
    `text-white text-base font-medium px-5 py-2.5 rounded-lg transition-all duration-300 inline-block relative overflow-hidden group ${
      pathname === path 
        ? 'bg-white/25 font-semibold shadow-lg shadow-white/20' 
        : 'hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-md'
    }`;

  return (
    <header className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-4 shadow-xl sticky top-0 z-[100] w-full backdrop-blur-md bg-opacity-95 border-b border-white/10">
      <nav className="max-w-[1400px] mx-auto px-6">
        <ul className="list-none flex justify-between items-center flex-wrap gap-3 m-0 p-0 w-full">
          <li className="flex items-center gap-4">
            <img 
              src={iconPath} 
              alt="Іконка" 
              className="w-[50px] h-[50px] rounded-xl object-cover shadow-lg ring-2 ring-white/20 transition-transform duration-300 hover:scale-110 hover:ring-white/40" 
            />
            <div className="flex items-center gap-2">
              <Link href="/" className={linkClasses('/')}>
                <span className="relative z-10">Home</span>
              </Link>
              <Link href="/events" className={linkClasses('/events')}>
                <span className="relative z-10">Events</span>
              </Link>
              <Link href="/booking" className={linkClasses('/booking')}>
                <span className="relative z-10">My booking</span>
              </Link>
            </div>
          </li>
          <li className="flex items-center gap-3">
            {currentUser ? (
              <>
                <span className="font-medium text-white text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  Привіт, {userData?.email || currentUser?.email || 'користувачу'}!
                </span>
                <button 
                  onClick={toggleTheme} 
                  className="bg-white/15 text-white border border-white/25 px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm flex items-center gap-2">
                  <span>{darkMode ? '☀️' : '🌙'}</span>
                  <span>{darkMode ? 'Light' : 'Dark'}</span>
                </button>
                <Link href="/profile" className={linkClasses('/profile')}>
                  <span className="relative z-10">Profile</span>
                </Link>
                <button
                  onClick={() => setShowConfirmLogout(true)}
                  className="text-white text-base font-medium px-5 py-2.5 rounded-lg transition-all duration-300 bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-md border border-white/20">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/logIn" className={linkClasses('/logIn')}>
                  <span className="relative z-10">LogIn</span>
                </Link>
                <button 
                  onClick={toggleTheme} 
                  className="bg-white/15 text-white border border-white/25 px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm flex items-center gap-2">
                  <span>{darkMode ? '☀️' : '🌙'}</span>
                  <span>{darkMode ? 'Light' : 'Dark'}</span>
                </button>
              </>
            )}
          </li>
        </ul>
      </nav>

      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center shadow-2xl max-w-[400px] w-[90%] border border-gray-200 dark:border-slate-700">
            <p className="text-text-primary dark:text-slate-100 mb-6 text-lg font-medium">Ви дійсно хочете вийти з акаунту?</p>
            <div className="flex gap-4 justify-center mt-6">
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 border-none rounded-lg cursor-pointer font-medium transition-all duration-300 bg-error text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg">
                Так
              </button>
              <button 
                onClick={() => setShowConfirmLogout(false)}
                className="px-6 py-2.5 border-none rounded-lg cursor-pointer font-medium transition-all duration-300 bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg">
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
